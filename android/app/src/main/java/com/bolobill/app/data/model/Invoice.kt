package com.bolobill.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

/**
 * Invoice: Room Database Entity for BoloBill offline-first persistence.
 *
 * EXTENDED ATTRIBUTES (PER SPECIFICATION):
 * - beforePhotoUri: Local Uri to "Before Work" proof thumbnail.
 * - afterPhotoUri: Local Uri to "After Work" proof thumbnail.
 * - warrantyTerm: "NO_WARRANTY", "15_DAYS", "30_DAYS", "90_DAYS".
 * - pdfLanguage: "HINGLISH" or "ENGLISH".
 * - paidDate: Epoch timestamp when payment was cleared.
 */
@Entity(tableName = "invoices")
@TypeConverters(InvoiceItemConverter::class)
data class Invoice(
    @PrimaryKey
    val id: String,
    val invoiceNumber: String,
    val clientName: String,
    val clientPhone: String,
    val clientAddress: String,
    val technicianName: String,
    val technicianTrade: String,
    val technicianUpiId: String,
    val items: List<InvoiceItem>,
    val subtotal: Double,
    val discount: Double = 0.0,
    val totalAmount: Double,
    val createdAt: Long = System.currentTimeMillis(),

    val isPaid: Boolean = false,
    val paidDate: Long? = null,
    val paymentMode: String? = "UPI",

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

class InvoiceItemConverter {
    private val gson = Gson()

    @TypeConverter
    fun fromItemList(items: List<InvoiceItem>?): String {
        return gson.toJson(items ?: emptyList<InvoiceItem>())
    }

    @TypeConverter
    fun toItemList(json: String?): List<InvoiceItem> {
        if (json.isNullOrEmpty()) return emptyList()
        val type = object : TypeToken<List<InvoiceItem>>() {}.type
        return gson.fromJson(json, type)
    }
}
