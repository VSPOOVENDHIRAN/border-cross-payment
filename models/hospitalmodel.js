import pool from "../config/db.js";

export const createHospital = async (data) => {
  const query = `
    INSERT INTO hospitals
    (name, type, ownership, address, phone, email, website,
     registration_number, registration_certificate,
     head_name, admin_contact, consent)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *;
  `;

  const values = [
    data.name,
    data.type,
    data.ownership,
    data.address,
    data.phone,
    data.email,
    data.website,
    data.registrationNumber,
    data.registrationCertificate,
    data.headName,
    data.adminContact,
    data.consent
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
