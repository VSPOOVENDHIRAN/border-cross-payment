export const registerHospital = (req, res) => {
  try {
    const { body, file } = req;

    console.log('Body:', body);
    console.log('Uploaded file:', file);

    res.status(201).json({
      message: 'Hospital registered successfully',
      data: { body, file }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
