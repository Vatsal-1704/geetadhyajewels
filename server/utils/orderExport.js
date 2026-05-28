const XLSX = require("xlsx");

exports.generateOrdersExcel = async (orders) => {
  // Prepare data for export
  const data = orders.map((order) => ({
    "Order ID": order.orderId,
    "Customer Name": order.user?.name || "N/A",
    "Email": order.user?.email || "N/A",
    "Phone": order.user?.phone || "N/A",
    "Items": order.items?.length || 0,
    "Total Price": order.totalPrice,
    "Status": order.orderStatus,
    "Payment Method": order.paymentMethod,
    "Payment Status": order.paymentStatus,
    "Courier": order.courierName || "-",
    "Tracking Number": order.trackingNumber || "-",
    "Created At": new Date(order.createdAt).toLocaleDateString("en-IN"),
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const colWidths = [15, 20, 25, 15, 10, 15, 15, 15, 15, 15, 20, 20];
  worksheet["!cols"] = colWidths.map((width) => ({ wch: width }));

  // Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

  // Add summary sheet
  const summaryData = [
    ["Summary"],
    [],
    [`Total Orders: ${orders.length}`],
    [`Total Revenue: ₹${orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toFixed(2)}`],
    [],
    ["Status Breakdown"],
  ];

  // Count by status
  const statusCounts = {};
  orders.forEach((order) => {
    statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;
  });

  Object.entries(statusCounts).forEach(([status, count]) => {
    summaryData.push([`${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}`]);
  });

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 30 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Write to buffer
  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
};

exports.generateErrorReportExcel = async (errors) => {
  const data = errors.map((err) => ({
    "Row Number": err.row,
    "Order ID": err.orderId,
    "Error Details": err.error,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet["!cols"] = [{ wch: 15 }, { wch: 15 }, { wch: 50 }];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Error Report");

  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
};
