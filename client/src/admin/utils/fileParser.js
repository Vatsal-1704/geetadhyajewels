import * as XLSX from "xlsx";

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet);
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};

export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split("\n").filter(line => line.trim());
        if (lines.length < 1) {
          resolve([]);
          return;
        }

        const headers = lines[0].split(",").map(h => h.trim());
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",");
          const row = {};
          headers.forEach((header, idx) => {
            row[header] = values[idx]?.trim() || "";
          });
          rows.push(row);
        }

        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
