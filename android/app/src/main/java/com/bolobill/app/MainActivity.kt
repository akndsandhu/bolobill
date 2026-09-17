package com.bolobill.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.bolobill.app.data.model.Invoice
import com.bolobill.app.ui.screens.BillBuilderScreen
import com.bolobill.app.ui.screens.PdfPreviewScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            var currentInvoice by remember {
                mutableStateOf(
                    Invoice(
                        id = "inv_${System.currentTimeMillis()}",
                        invoiceNumber = "BB-${System.currentTimeMillis().toString().takeLast(4)}",
                        clientName = "",
                        clientPhone = "",
                        clientAddress = "",
                        technicianName = "Technician",
                        technicianTrade = "Service Specialist",
                        technicianUpiId = "payee@upi",
                        items = emptyList(),
                        subtotal = 0.0,
                        totalAmount = 0.0
                    )
                )
            }
            var currentScreen by remember { mutableStateOf("BUILDER") }

            if (currentScreen == "BUILDER") {
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
