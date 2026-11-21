const products = {
  "636836837378377": {
    name: "ارز ابو كاس پشاوري",
    weight: "١٠ كيلو",
    price: "85"
  },
  "1234567890123": {
    name: "زيت نباتي للطبخ",
    weight: "١.٥ لتر",
    price: "19"
  },
  "9876543210987": {
    name: "سكر ناعم",
    weight: "٥ كيلو",
    price: "22"
  }
};

const scanInput = document.getElementById("scanInput");
const statusMsg = document.getElementById("statusMsg");
const printBtn = document.getElementById("printBtn");

function renderBarcode(code) {
  const svgEl = document.getElementById("barcode");
  if (!svgEl || typeof JsBarcode === "undefined") return;

  JsBarcode("#barcode", code, {
    format: "CODE128",
    width: 1.6,
    height: 48,
    displayValue: true,
    fontSize: 13,
    margin: 4
  });
}

function loadByBarcode(code) {
  const cleanCode = code.trim();
  if (!cleanCode) return;

  const item = products[cleanCode];
  if (item) {
    const nameEl = document.getElementById("vName");
    const weightEl = document.getElementById("vWeight");
    const priceEl = document.getElementById("vPrice");

    if (nameEl) nameEl.textContent = item.name;
    if (weightEl) weightEl.textContent = item.weight;
    if (priceEl) priceEl.textContent = item.price;

    renderBarcode(cleanCode);
    if (statusMsg) {
      statusMsg.textContent = "وموندل شو: " + item.name + " (" + cleanCode + ")";
    }
  } else {
    renderBarcode(cleanCode);
    if (statusMsg) {
      statusMsg.textContent = "دا بارکوډ په لېست کې نشته: " + cleanCode;
    }
  }

  if (scanInput) {
    scanInput.value = "";
    scanInput.focus();
  }
}

if (scanInput) {
  scanInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      loadByBarcode(scanInput.value);
    }
  });
}

if (printBtn) {
  printBtn.addEventListener("click", function () {
    const area = document.getElementById("printArea");
    if (!area) {
      if (statusMsg) statusMsg.textContent = "د چاپ برخه (printArea) ونه موندل شوه.";
      return;
    }

    const printWindow = window.open("", "_blank", "width=650,height=500");
    if (!printWindow) {
      if (statusMsg) {
        statusMsg.textContent = "براوزر نوې کړکۍ بنده کړې؛ د چاپ لپاره Pop-up ته Allow ورکړئ.";
      }
      return;
    }

    const styles = Array.from(document.querySelectorAll("style"))
      .map(function (s) {
        return s.innerHTML;
      })
      .join("\n");

    const htmlDoc =
      "<!DOCTYPE html><html dir='rtl'><head><meta charset='UTF-8'><title>Print</title><style>" +
      styles +
      "body{font-family:Tahoma,Arial,sans-serif;margin:20px;display:flex;justify-content:center;}.card{box-shadow:none!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}</style></head><body>" +
      area.innerHTML +
      "<script>window.onload=function(){window.focus();window.print();};<\/script></body></html>";

    printWindow.document.open();
    printWindow.document.write(htmlDoc);
    printWindow.document.close();
  });
}

renderBarcode("636836837378377");
