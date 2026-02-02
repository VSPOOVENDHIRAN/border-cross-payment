const  supabaseAdmin  = require("../config/supabase");
const { sendPasswordSetupEmail } = require("../config/mailer");
// services/authService.js

async function createUserAndSendPasswordLink(email) {
  if (!email) {
    throw new Error("Email is required");
  }

  // 1️⃣ Create user in Supabase Auth
  const { error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    });

  if (createError) {
    throw new Error(createError.message);
  }

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


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
     console.log("Login attempt for email:", email);
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }
    console.log("Authenticating with Supabase...");

    const { data, error } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Supabase authentication response:", data, error);

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Login successful",
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: "hospital_admin",
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  login,
  createUserAndSendPasswordLink,
};
