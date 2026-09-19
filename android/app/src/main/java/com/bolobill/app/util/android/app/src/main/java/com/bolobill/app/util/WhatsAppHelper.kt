package com.bolobill.app.util

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import java.net.URLEncoder

object WhatsAppHelper {
    fun sendPaymentReminder(
        context: Context,
        clientPhone: String,
        clientName: String,
        balanceDue: Double,
        shopName: String,
        upiId: String
    ) {
        val cleanPhone = clientPhone.filter { it.isDigit() }.takeLast(10)
        if (cleanPhone.length != 10) {
            Toast.makeText(context, "Sahi 10-digit mobile number nahi hai", Toast.LENGTH_SHORT).show()
            return
        }

        val upiLink = "upi://pay?pa=$upiId&pn=${URLEncoder.encode(shopName, "UTF-8")}&am=$balanceDue&cu=INR"
        val message = """
            *नमस्ते $clientName जी,*
            
            आपकी दुकान *$shopName* से सेवा / सामान का ₹${String.format("%.2f", balanceDue)} का भुगतान बाकी है।
            
            कृपया नीचे दी गई UPI ID या डायरेक्ट लिंक पर भुगतान करें:
            *UPI ID:* $upiId
            *Pay Link:* $upiLink
            
            धन्यवाद!
            *$shopName*
        """.trimIndent()

        try {
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("https://api.whatsapp.com/send?phone=91$cleanPhone&text=${URLEncoder.encode(message, "UTF-8")}")
                setPackage("com.whatsapp")
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            val browserIntent = Intent(
                Intent.ACTION_VIEW,
                Uri.parse("https://wa.me/91$cleanPhone?text=${URLEncoder.encode(message, "UTF-8")}")
            )
            context.startActivity(browserIntent)
        }
    }
}
