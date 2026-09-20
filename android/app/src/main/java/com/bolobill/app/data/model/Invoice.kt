package com.bolobill.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

@Entity(tableName = "invoices")
@TypeConverters(InvoiceItemConverter::class)
data class Invoice(
    @PrimaryKey
    val id: String,
    val invoiceNumber: String,
    val clientName: String,
    val clientPhone: String,
    val clientAddress: String = "",
    val technicianName: String = "",
    val technicianPhone: String = "",
    val technicianTrade: String = "",
    val technicianUpiId: String = "",
    val items: List<InvoiceItem>,
    val subtotal: Double,
    val advanceAmount: Double = 0.0,
    val discount: Double = 0.0,
    
    // GST & Invoice Types
    val isGstInvoice: Boolean = false,
    val isEstimate: Boolean = false,
    val gstNumber: String = "",
    val gstRate: Double = 18.0,
    val gstAmount: Double = 0.0,

    // Split Payment Mode
    val paymentMode: String? = "UPI",
    val cashReceived: Double = 0.0,
    val onlineReceived: Double = 0.0,

    // Signature & Star Rating
    val signaturePath: String? = null,
    val customerRating: Int = 5,
    val customerFeedback: String = "",

    val totalAmount: Double,
    val createdAt: Long = System.currentTimeMillis(),
    val isPaid: Boolean = false,
    val paidDate: Long? = null,
    val beforePhotoUri: String? = null,
    val afterPhotoUri: String? = null,
    val warrantyTerm: String? = "30_DAYS",
    val pdfLanguage: String = "ENGLISH",
    val notes: String? = null
)

data class InvoiceItem(
    val id: String,
    val name: String,
    val quantity: Int = 1,
    val unit: String = "nos",
    val rate: Double = 0.0,
    val amount: Double = 0.0
)

// Daily Expense Model (DailyExpenseScreen ke liye)
data class DailyExpense(
    val id: String,
    val category: String,
    val note: String,
    val amount: Double,
    val date: Long = System.currentTimeMillis()
)

// Job Card Model
data class JobCard(
    val id: String,
    val tokenNumber: String,
    val customerName: String,
    val customerPhone: String,
    val itemName: String,
    val problemDescription: String,
    val estimatedCost: Double,
    val advancePaid: Double = 0.0,
    val photoUri: String? = null,
    val status: String = "RECEIVED",
    val createdAt: Long = System.currentTimeMillis()
)

// Helper Wage Model
data class HelperWage(
    val id: String,
    val helperName: String,
    val date: Long = System.currentTimeMillis(),
    val dailyRate: Double,
    val advancePaid: Double = 0.0,
    val attendance: String = "PRESENT"
)

class InvoiceItemConverter {
    private val gson = Gson()

    @TypeConverter
    fun fromItemList(items: List<InvoiceItem>?): String = gson.toJson(items ?: emptyList<InvoiceItem>())

    @TypeConverter
    fun toItemList(json: String?): List<InvoiceItem> {
        if (json.isNullOrEmpty()) return emptyList()
        val type = object : TypeToken<List<InvoiceItem>>() {}.type
        return gson.fromJson(json, type)
    }
}
