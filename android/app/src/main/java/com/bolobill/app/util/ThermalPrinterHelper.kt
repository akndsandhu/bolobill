package com.bolobill.app.util

import com.bolobill.app.data.model.Invoice
import java.io.ByteArrayOutputStream
import java.text.SimpleDateFormat
import java.util.*

object ThermalPrinterHelper {

    // ESC/POS Commands
    private val ESC: Byte = 0x1B
    private val GS: Byte = 0x1D
    private val INIT = byteArrayOf(ESC, 0x40)
    private val ALIGN_CENTER = byteArrayOf(ESC, 0x61, 0x01)
    private val ALIGN_LEFT = byteArrayOf(ESC, 0x61, 0x00)
    private val ALIGN_RIGHT = byteArrayOf(ESC, 0x61, 0x02)
    private val BOLD_ON = byteArrayOf(ESC, 0x45, 0x01)
    private val BOLD_OFF = byteArrayOf(ESC, 0x45, 0x00)
    private val DOUBLE_SIZE = byteArrayOf(GS, 0x21, 0x11)
    private val NORMAL_SIZE = byteArrayOf(GS, 0x21, 0x00)
    private val FEED_LINE = byteArrayOf(0x0A)
    private val CUT_PAPER = byteArrayOf(GS, 0x56, 0x00)

    fun generate58mmReceipt(invoice: Invoice): ByteArray {
        val stream = ByteArrayOutputStream()

        fun write(bytes: ByteArray) = stream.write(bytes)
        fun writeText(text: String) = stream.write((text + "\n").toByteArray(charset("GBK")))

        write(INIT)
        
        // Header
        write(ALIGN_CENTER)
        write(DOUBLE_SIZE)
        write(BOLD_ON)
        writeText(invoice.technicianName)
        write(NORMAL_SIZE)
        write(BOLD_OFF)
        if (invoice.technicianPhone.isNotEmpty()) {
            writeText("Mo: +91 ${invoice.technicianPhone}")
        }
        writeText("--------------------------------")

        // Meta Info
        write(ALIGN_LEFT)
        val dateStr = SimpleDateFormat("dd/MM/yyyy hh:mm a", Locale.getDefault()).format(Date(invoice.createdAt))
        writeText("Bill #: ${invoice.invoiceNumber}")
        writeText("Date  : $dateStr")
        writeText("Client: ${invoice.clientName} (${invoice.clientPhone})")
        writeText("--------------------------------")

        // Items Header (32 characters wide)
        writeText("Item              Qty  Rate  Amt")
        writeText("--------------------------------")

        // Items List
        invoice.items.forEach { item ->
            val itemName = if (item.name.length > 14) item.name.take(12) + ".." else item.name.padEnd(14)
            val qtyUnit = "${item.quantity}${item.unit}".take(5).padEnd(5)
            val rate = String.format("%.0f", item.rate).padStart(5)
            val amt = String.format("%.0f", item.amount).padStart(6)
            writeText("$itemName $qtyUnit $rate $amt")
        }

        writeText("--------------------------------")
        write(ALIGN_RIGHT)
        writeText("Subtotal: Rs. ${String.format("%.2f", invoice.subtotal)}")
        if (invoice.advanceAmount > 0) {
            writeText("Advance Paid: Rs. ${String.format("%.2f", invoice.advanceAmount)}")
        }
        write(BOLD_ON)
        writeText("BALANCE DUE: Rs. ${String.format("%.2f", invoice.totalAmount)}")
        write(BOLD_OFF)
        writeText("--------------------------------")

        // Footer
        write(ALIGN_CENTER)
        if (invoice.technicianUpiId.isNotEmpty()) {
            writeText("Pay via UPI: ${invoice.technicianUpiId}")
        }
        writeText("Thank You! Visit Again")
        write(FEED_LINE)
        write(FEED_LINE)
        write(CUT_PAPER)

        return stream.toByteArray()
    }
}
