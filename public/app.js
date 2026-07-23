const statusDot = document.querySelector("#statusDot");
const statusTitle = document.querySelector("#statusTitle");
const statusText = document.querySelector("#statusText");
const webhookUrl = document.querySelector("#webhookUrl");
const copyWebhook = document.querySelector("#copyWebhook");
const testForm = document.querySelector("#testForm");
const message = document.querySelector("#message");
const replyBox = document.querySelector("#replyBox");

init();

async function init() {
  const response = await fetch("/api/status");
  const status = await response.json();
  const absoluteWebhook = `${window.location.origin}${status.webhookPath}`;

  webhookUrl.textContent = absoluteWebhook;

  if (status.lineConfigured) {
    statusDot.classList.add("ready");
    statusTitle.textContent = "พร้อมเชื่อม LINE OA";
    statusText.textContent = "ตั้งค่า Channel secret และ access token แล้ว";
  } else {
    statusTitle.textContent = "ยังต้องใส่ค่า LINE";
    statusText.textContent = "สร้างไฟล์ .env จาก .env.example แล้วเติมข้อมูลจาก LINE Developers";
  }
}

copyWebhook.addEventListener("click", async () => {
  await navigator.clipboard.writeText(webhookUrl.textContent);
  copyWebhook.textContent = "คัดลอกแล้ว";
  setTimeout(() => {
    copyWebhook.textContent = "คัดลอก";
  }, 1400);
});

testForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  replyBox.textContent = "กำลังทดสอบ...";

  const response = await fetch("/api/test-reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message.value }),
  });

  const data = await response.json();
  replyBox.textContent = data.reply || "ไม่มีข้อความตอบกลับ";
});
