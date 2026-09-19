package com.bolobill.app

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.bolobill.app.data.model.Invoice
import com.bolobill.app.ui.screens.BillBuilderScreen
import com.bolobill.app.ui.screens.OnboardingScreen
import com.bolobill.app.ui.screens.PdfPreviewScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val prefs = remember { getSharedPreferences("bolobill_prefs", Context.MODE_PRIVATE) }
            var isRegistered by remember { mutableStateOf(prefs.getBoolean("is_registered", false)) }

            val savedShop = prefs.getString("shop_name", "सर्विस सेंटर") ?: "सर्विस सेंटर"
            val savedPhone = prefs.getString("phone", "") ?: ""
            val savedCity = prefs.getString("city", "") ?: ""
            val savedUpi = prefs.getString("upi_id", "") ?: ""

            var currentInvoice by remember {
                mutableStateOf(
                    Invoice(
                        id = "inv_${System.currentTimeMillis()}",
                        invoiceNumber = "BB-${System.currentTimeMillis().toString().takeLast(4)}",
                        clientName = "",
                        clientPhone = "",
                        clientAddress = "",
                        technicianName = savedShop,
                        technicianPhone = savedPhone,
                        technicianTrade = savedCity,
                        technicianUpiId = savedUpi,
                        items = emptyList(),
                        subtotal = 0.0,
                        totalAmount = 0.0
                    )
                )
            }
            var currentScreen by remember { mutableStateOf("BUILDER") }

            if (!isRegistered) {
                OnboardingScreen(
                    onRegistrationComplete = { name, shop, city, phone, upi ->
                        currentInvoice = currentInvoice.copy(
                            technicianName = shop,
                            technicianPhone = phone,
                            technicianTrade = city,
                            technicianUpiId = upi
                        )
                        isRegistered = true
                    }
                )
            } else if (currentScreen == "BUILDER") {
                BillBuilderScreen(
                    currentInvoice = currentInvoice,
                    onSaveInvoice = { currentInvoice = it },
                    onNavigateToPreview = {
                        currentInvoice = it
                        currentScreen = "PREVIEW"
                    }
                )
            } else {
                PdfPreviewScreen(
                    invoice = currentInvoice,
                    onInvoiceUpdated = { currentInvoice = it },
                    onBack = { currentScreen = "BUILDER" }
                )
            }
        }
    }
}
