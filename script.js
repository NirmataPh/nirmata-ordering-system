// ============================================================
// NIRMATA ORDERING SYSTEM - Supabase connection + form handler
// ============================================================

const SUPABASE_URL = "https://ziyxrzqyqpsfupvmmavn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeXhyenF5cXBzZnVwdm1tYXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NjM3NTAsImV4cCI6MjEwMTIzOTc1MH0.gGEqlh4MwttVApAlhGF3KpDDvhoWlxnht_Dytm9Ok0I";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("order-form");
const statusMsg = document.getElementById("status-msg");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Sinusubmit...";
  statusMsg.textContent = "";
  statusMsg.className = "";

  try {
    const customerName = document.getElementById("customer_name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const product = document.getElementById("product").value.trim();
    const customization = document.getElementById("customization").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value, 10);
    const totalAmount = parseFloat(document.getElementById("total_amount").value);
    const notes = document.getElementById("notes").value.trim();
    const fileInput = document.getElementById("file");

    let fileUrl = null;

    // Kung may inupload na file, ilagay muna sa Supabase Storage
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const filePath = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabaseClient.storage
        .from("order-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseClient.storage
        .from("order-files")
        .getPublicUrl(filePath);

      fileUrl = publicUrlData.publicUrl;
    }

    // I-insert ang order sa public.orders table
    // Hindi na natin ilalagay ang order_number dito - awtomatiko itong
    // gagawin ng database trigger (tingnan ang supabase-schema.sql)
    const { data, error } = await supabaseClient
      .from("orders")
      .insert([
        {
          customer_name: customerName,
          phone,
          email,
          product,
          customization,
          quantity,
          total_amount: totalAmount,
          notes,
          file_url: fileUrl,
          status: "Pending",
        },
      ])
      .select();

    if (error) throw error;

    const orderNumber = data[0].order_number;

    statusMsg.textContent = `Salamat! Order number mo: ${orderNumber}. I-save mo ito.`;
    statusMsg.className = "success";
    form.reset();
  } catch (err) {
    console.error(err);
    statusMsg.textContent = "May error, subukan ulit. (" + err.message + ")";
    statusMsg.className = "error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "I-submit ang Order";
  }
});
