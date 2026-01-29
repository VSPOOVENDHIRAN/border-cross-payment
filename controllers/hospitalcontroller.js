const sql = require("../config/db.js");
const pool = require("../config/db.js");
const supabaseAdmin = require("../config/supabase.js");
const path = require("path");
const { sendPasswordSetupEmail } = require("../config/mailer");


async function createUserAndSendPasswordLink(email) {
  if (!email) {
    throw new Error("Email is required");
  }

  // 1️⃣ Create user in Supabase Auth
  console.log("Creating user in Supabase Auth for email:", email);
  const { error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    });

  if (createError) {
    throw new Error(createError.message);
  }
   console.log("User created successfully in Supabase Auth.");
  // 2️⃣ Generate recovery link
  const { data, error } =
    await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: "http://localhost:3000/set-password",
      },
    });

  if (error) {
    throw new Error(error.message);
  }

  const resetLink = data.properties.action_link;

  console.log("Generated password setup link:", resetLink);

  // 3️⃣ Send email manually
  await sendPasswordSetupEmail(email, resetLink);

  return true;
}

const registerHospitalRequest = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Registration certificate is required",
      });
    }

    const {
      hospital_name,
      hospital_type,
      ownership_type,
      country,
      state,
      city,
      postal_code,
      address,
      official_email,
      official_phone,
      website,
      registration_number,
      admin_name,
      admin_contact,
      consent_given,
    } = req.body;

    // 🔎 Check pending request by email
    const existingRequest = await sql`
      SELECT id
      FROM hospital_requests
      WHERE official_email = ${official_email}
        AND request_status = 'pending'
    `;

    if (existingRequest.length > 0) {
      return res.status(400).json({
        error: "A pending request with this email already exists",
      });
    }

    // 🔎 Check already registered hospital
    const registeredHospital = await sql`
      SELECT id
      FROM hospitals
      WHERE official_email = ${official_email}
    `;

    if (registeredHospital.length > 0) {
      return res.status(400).json({
        error: "This hospital is already registered",
      });
    }

    // 🔎 Check pending request by registration number
    const requestedAlready = await sql`
      SELECT id
      FROM hospital_requests
      WHERE registration_number = ${registration_number}
        AND request_status = 'pending'
    `;

    if (requestedAlready.length > 0) {
      return res.status(400).json({
        error: "A pending request with this registration number already exists",
      });
    }

    // 🔎 Check phone number uniqueness
    const registeredPhone = await sql`
      SELECT id
      FROM hospitals
      WHERE official_phone = ${official_phone}
    `;

    if (registeredPhone.length > 0) {
      return res.status(400).json({
        error: "This hospital phone number is already registered",
      });
    }

    if (consent_given !== "true" && consent_given !== true) {
      return res.status(400).json({ error: "Consent is mandatory" });
    }

    // ✅ Insert hospital request
    const inserted = await sql`
      INSERT INTO hospital_requests (
        hospital_name,
        hospital_type,
        ownership_type,
        country,
        state,
        city,
        postal_code,
        address,
        official_email,
        official_phone,
        website,
        registration_number,
        admin_name,
        admin_contact,
        consent_given
      )
      VALUES (
        ${hospital_name},
        ${hospital_type},
        ${ownership_type},
        ${country},
        ${state},
        ${city || null},
        ${postal_code || null},
        ${address},
        ${official_email},
        ${official_phone},
        ${website || null},
        ${registration_number},
        ${admin_name},
        ${admin_contact},
        ${consent_given}
      )
      RETURNING id
    `;

    const requestId = inserted[0].id;

    // 📤 Upload certificate to Supabase Storage
    const ext = path.extname(req.file.originalname);
    const storagePath = `hospitals/pending/${requestId}/registration_certificate${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("hospital-registration-certificates")
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 💾 Save file path
    await sql`
      UPDATE hospital_requests
      SET registration_certificate_url = ${storagePath}
      WHERE id = ${requestId}
    `;

    res.status(201).json({
      message: "Hospital registration request submitted",
      request_id: requestId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { registerHospitalRequest };

function generateHospitalRefCode(country, city, hospitalName, seq) {
  const shortName = hospitalName
    .replace(/[^A-Za-z]/g, "")
    .substring(0, 3)
    .toUpperCase();

  return `${country}-${city.substring(0,3).toUpperCase()}-${shortName}-${String(seq).padStart(2, "0")}`;
}

//changed update to sql\
 const updateRequestStatus = async (req, res) => {
  try {
    console.log("Updating request status...");
    const { id } = req.params;
    const { status, reviewed_by } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        error: "Status must be approved or rejected",
      });
    }

    const result = await sql.begin(async (tx) => {
      // 1️⃣ Fetch pending request
      const requests = await tx`
        SELECT *
        FROM hospital_requests
        WHERE id = ${id}
          AND request_status = 'pending'
      `;

      if (requests.length === 0) {
        throw new Error("Request not found or already processed");
      }

      const request = requests[0];

      // 2️⃣ Update request status
      await tx`
        UPDATE hospital_requests
        SET
          request_status = ${status},
          reviewed_by = ${reviewed_by},
          reviewed_at = NOW()
        WHERE id = ${id}
      `;

      // ❌ Stop here if rejected
      if (status === "rejected") {
      //   await tx`
      //   UPDATE hospital_requests
      //   SET
      //     request_status = ${status},
      //     reviewed_by = ${reviewed_by},
      //     reviewed_at = NOW()
      //   WHERE id = ${id}
      // `;
        return { rejected: true };
      }

      // 3️⃣ Insert hospital with UNIQUE hospital_ref_code
      let hospital;
      let attempt = 0;
     console.log("Generating unique hospital_ref_code...");
      while (attempt < 5) {
        attempt++;

        // get next sequence number (simple & safe)
        const [{ count }] = await tx`
          SELECT COUNT(*)::int AS count
          FROM hospitals
          WHERE country = ${request.country}
            AND city = ${request.city}
        `;

        const refCode = generateHospitalRefCode(
          request.country,
          request.city,
          request.hospital_name,
          count + 1
        );

        console.log(`Attempt ${attempt}: Trying refCode ${refCode}`);

        try {
          const hospitals = await tx`
            INSERT INTO hospitals (
              hospital_name,
              hospital_type,
              ownership_type,
              country,
              state,
              city,
              postal_code,
              address,
              official_email,
              official_phone,
              website,
              registration_number,
              registration_certificate_url,
              admin_name,
              admin_contact,
              verified_by,
              hospital_ref_code
            ) VALUES (
              ${request.hospital_name},
              ${request.hospital_type},
              ${request.ownership_type},
              ${request.country},
              ${request.state},
              ${request.city},
              ${request.postal_code},
              ${request.address},
              ${request.official_email},
              ${request.official_phone},
              ${request.website},
              ${request.registration_number},
              ${request.registration_certificate_url},
              ${request.admin_name},
              ${request.admin_contact},
              ${reviewed_by},
              ${refCode}
            )
            RETURNING *
          `;
          console.log("Hospital inserted with refCode:", refCode);
          hospital = hospitals[0];
          break; // ✅ success

        } catch (err) {
          if (err.code === "23505") {
            // UNIQUE violation → retry
            continue;
          }
          throw err;
        }
      }

      if (!hospital) {
        throw new Error("Failed to generate unique hospital_ref_code");
      }

      return { hospital, request };
    });

    if (result.rejected) {
      return res.json({
        message: "Hospital request rejected successfully",
      });
    }
    
    await createUserAndSendPasswordLink(result.request.official_email);
    

    res.json({
      message: "Hospital approved successfully",
      hospital: result.hospital,
    });

  } catch (error) {
    console.error("Approval error:", error.message);
    res.status(500).json({ error: error.message });
  }
};


const getHospitalRequests = async (req, res) => {
  try {
    const { status = "pending" } = req.query;

    // Validate status
    const allowedStatus = ["pending", "approved", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid request status" });
    }

    const result = await pool.query(
      `
      SELECT 
        id,
        hospital_name,
        hospital_type,
        ownership_type,
        country,
        state,
        city,
        postal_code,
        address,
        official_email,
        official_phone,
        website,
        registration_number,
        admin_name,
        admin_contact,
        consent_given,
        request_status,
        registration_certificate_url,
        created_at
      FROM hospital_requests
      WHERE request_status = $1
      ORDER BY created_at DESC
      `,
      [status]
    );

    res.status(200).json({
      total: result.rows.length,
      status,
      requests: result.rows,
    });

  } catch (err) {
    console.error("Error fetching hospital requests:", err);
    res.status(500).json({ error: "Failed to fetch hospital requests" });
  }
};




  const getPendingRequests = async (req, res) => {
  try {
    const rows = await sql`
      SELECT
        id,
        hospital_name,
        registration_certificate_url
      FROM hospital_requests
      WHERE request_status = 'pending'
      ORDER BY created_at DESC
    `;

    const requestsWithSignedUrls = await Promise.all(
      rows.map(async (row) => {
        if (!row.registration_certificate_url) {
          return { ...row, certificate_view_url: null };
        }

        const { data, error } = await supabase.storage
          .from("hospital-registration-certificates")
          .createSignedUrl(row.registration_certificate_url, 900);

        if (error) {
          console.error("Signed URL error:", error.message);
          return { ...row, certificate_view_url: null };
        }

        return {
          ...row,
          certificate_view_url: data.signedUrl,
        };
      })
    );

    res.json({ data: requestsWithSignedUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const createEmergencyCase = async (req, res) => {
  try {
    console.log("ksnvns");
    const {
      source_country,
      destination_hospital_ref_code,
      destination_country,
      patient_age,
      patient_gender,
      patient_nationality,
      primary_diagnosis_code,
      diagnosis_code_system,
      life_threatening,
      urgency_level,
      treatment_complexity,
      consciousness_status,
      airway_status,
      breathing_status,
      circulation_status,
      primary_procedure_code,
      procedure_code_system,
      required_specialty,
      estimated_treatment_cost,
      currency,
      automation_justification_code,
      emergency_override_consent,
      consent_reason,
      created_by
    } = req.body;
     
    console.log("Creating emergency case 1...");
    // 🔒 Mandatory consent check (automation-safe)
    if (emergency_override_consent !== true && emergency_override_consent !== "true") {
      return res.status(400).json({
        error: "Emergency override consent is mandatory"
      });
    }
    console.log("Creating emergency case 2...");

    //if(source_country!==)

    // 🌍 Cross-border safety check (extra layer over DB constraint)
    if (source_country === destination_country) {
      return res.status(400).json({
        error: "Source and destination country must be different"
      });
    }

    console.log("Creating emergency case...");

    // ✅ Insert emergency case
    const inserted = await sql`
      INSERT INTO public.emergency_cases (
        source_country,
        destination_hospital_ref_code,
        destination_country,
        patient_age,
        patient_gender,
        patient_nationality,
        primary_diagnosis_code,
        diagnosis_code_system,
        life_threatening,
        urgency_level,
        treatment_complexity,
        consciousness_status,
        airway_status,
        breathing_status,
        circulation_status,
        primary_procedure_code,
        procedure_code_system,
        required_specialty,
        estimated_treatment_cost,
        currency,
        automation_justification_code,
        emergency_override_consent,
        consent_reason,
        created_by
      )
      VALUES (
        ${source_country},
        ${destination_hospital_ref_code},
        ${destination_country},
        ${patient_age},
        ${patient_gender},
        ${patient_nationality},
        ${primary_diagnosis_code},
        ${diagnosis_code_system},
        ${life_threatening},
        ${urgency_level},
        ${treatment_complexity},
        ${consciousness_status},
        ${airway_status},
        ${breathing_status},
        ${circulation_status},
        ${primary_procedure_code},
        ${procedure_code_system},
        ${required_specialty},
        ${estimated_treatment_cost},
        ${currency},
        ${automation_justification_code},
        ${emergency_override_consent},
        ${consent_reason},
        ${created_by}
      )
      RETURNING emergency_id, status, created_at
    `;
    console.log("Emergency case created:", inserted[0]);
    res.status(201).json({
      message: "Emergency case created successfully",
      emergency_id: inserted[0].emergency_id,
      status: inserted[0].status,
      created_at: inserted[0].created_at
    });

  } catch (err) {
    console.error("Emergency creation error:", err);
    res.status(500).json({
      error: err.message
    });
  }
};

const addHospitalSettlementAccount = async (req, res) => {
  try {
    const {
      auth_user_id,
      account_holder_name,
      bank_name,
      account_number,
      currency,
      country,
      ifsc_code,
      swift_code,
      iban
    } = req.body;

    console.log("Adding hospital settlement account...");

    /* ---------------- REQUIRED FIELD CHECK ---------------- */

    if (
      !account_holder_name ||
      !bank_name ||
      !account_number ||
      !currency ||
      !country
    ) {
      return res.status(400).json({
        error: "Required bank account details are missing"
      });
    }

    /* ---------------- FETCH HOSPITAL ---------------- */
     console.log(auth_user_id); 

    const hospital = await sql`
      SELECT id
      FROM public.hospitals
      WHERE auth_user_id = ${"9211f387-becb-47cd-9297-6af353b95e41"}
      LIMIT 1
    `;

    if (hospital.length === 0) {
      return res.status(404).json({
        error: "Hospital not found"
      });
    }

    const hospital_id = hospital[0].id;

    /* ---------------- CHECK EXISTING PRIMARY ACCOUNT ---------------- */

    const existingAccount = await sql`
      SELECT id
      FROM public.hospital_settlement_accounts
      WHERE hospital_id = ${hospital_id}
        AND is_primary = true
      LIMIT 1
    `;

    if (existingAccount.length > 0) {
      return res.status(409).json({
        error: "Settlement account already exists for this hospital"
      });
    }

    /* ---------------- INSERT SETTLEMENT ACCOUNT ---------------- */

    const inserted = await sql`
      INSERT INTO public.hospital_settlement_accounts (
        hospital_id,
        account_holder_name,
        bank_name,
        account_number,
        currency,
        country,
        ifsc_code,
        swift_code,
        iban,
        verification_status,
        is_primary
      )
      VALUES (
        ${hospital_id},
        ${account_holder_name},
        ${bank_name},
        ${account_number},
        ${currency},
        ${country},
        ${ifsc_code || null},
        ${swift_code || null},
        ${iban || null},
        'pending',
        true
      )
      RETURNING id, verification_status, created_at
    `;

    console.log("Settlement account added:", inserted[0]);

    return res.status(201).json({
      message: "Settlement account submitted successfully",
      account_id: inserted[0].id,
      verification_status: inserted[0].verification_status,
      created_at: inserted[0].created_at
    });

  } catch (err) {
    console.error("Settlement account error:", err);
    return res.status(500).json({
      error: err.message
    });
  }
};
const updateHospitalSettlementAccount = async (req, res) => {
  try {

    console.log("Updating hospital settlement account...");
    const { auth_user_id } = req.user;

    const {
      account_holder_name,
      bank_name,
      account_number,
      currency,
      country,
      ifsc_code,
      swift_code,
      iban
    } = req.body;

    /* ---------------- FETCH HOSPITAL ---------------- */

    const hospital = await sql`
      SELECT id
      FROM public.hospitals
      WHERE auth_user_id = ${auth_user_id}
      LIMIT 1
    `;
    console.log("Hospital fetched:", hospital);
    if (hospital.length === 0) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    const hospital_id = hospital[0].id;

    /* ---------------- FETCH ACCOUNT ---------------- */

    const account = await sql`
      SELECT id, verification_status
      FROM public.hospital_settlement_accounts
      WHERE hospital_id = ${hospital_id}
        AND is_primary = true
      LIMIT 1
    `;
    
    console.log("Settlement account fetched:", account);

    if (account.length === 0) {
      return res.status(404).json({ error: "Settlement account not found" });
    }

    if (account[0].verification_status === "verified") {
      return res.status(403).json({
        error: "Verified account cannot be modified. Contact admin."
      });
    }

    /* ---------------- BUILD UPDATE FIELDS SAFELY ---------------- */

    const updates = {};
    console.log("Building update fields...");

    if (account_holder_name !== undefined)
      updates.account_holder_name = account_holder_name;

    if (bank_name !== undefined)
      updates.bank_name = bank_name;

    if (account_number !== undefined)
      updates.account_number = account_number;

    if (currency !== undefined)
      updates.currency = currency;

    if (country !== undefined)
      updates.country = country;

    if (ifsc_code !== undefined)
      updates.ifsc_code = ifsc_code;

    if (swift_code !== undefined)
      updates.swift_code = swift_code;

    if (iban !== undefined)
      updates.iban = iban;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "No fields provided to update"
      });
    }

    /* ---------------- EXECUTE UPDATE ---------------- */
     console.log("Executing update...", updates);
    const updated = await sql`
      UPDATE public.hospital_settlement_accounts
      SET ${sql(updates)}, updated_at = now()
      WHERE hospital_id = ${hospital_id}
        AND is_primary = true
      RETURNING id, verification_status, updated_at
    `;
    console.log("Settlement account updated:", updated[0]);
    return res.status(200).json({
      message: "Settlement account updated successfully",
      account_id: updated[0].id,
      verification_status: updated[0].verification_status,
      updated_at: updated[0].updated_at
    });

  } catch (err) {
    console.error("Update settlement account error:", err);
    return res.status(500).json({ error: err.message });
  }
};

//module.exports = { createEmergencyCase };
 
module.exports = {
  registerHospitalRequest,
  getHospitalRequests,
  updateRequestStatus,
  getPendingRequests,
  createEmergencyCase,
  addHospitalSettlementAccount,
  updateHospitalSettlementAccount
};

