package com.bolobill.app.pdf

import android.content.Context
import android.graphics.*
import android.graphics.pdf.PdfDocument
import android.net.Uri
import com.bolobill.app.data.model.Invoice
import com.bolobill.app.util.PhotoPickerHelper
import com.google.zxing.BarcodeFormat
import com.google.zxing.qrcode.QRCodeWriter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.net.URLEncoder
import java.text.SimpleDateFormat
import java.util.*

/**
 * PdfGenerator: Generates High-Resolution A4 PDFs on native Android Canvas.
 *
 * FEATURES:
 * 1. Dynamic UPI QR Generation via ZXing QRCodeWriter (when unpaid).
 * 2. Dynamic Y-coordinate calculation (getDynamicPhotoY) to prevent item & totals overlap.
 * 3. Before & After Bitmaps:
 *    - Memory-safe bitmap decoding with inSampleSize to prevent OOM.
 * 4. Service Guarantee / Warranty Badge:
 *    - Circular vector stamp: "BOLOBILL VERIFIED • [X] DAYS SERVICE GUARANTEE".
 * 5. Instant Payment Receipt Mode:
 *    - Renders diagonal semi-transparent green watermark: "PAID / पूर्ण भुगतान प्राप्त" across center.
 *    - Suppresses UPI QR Code when invoice is marked as paid, replacing with clearance timestamp.
 * 6. Scoped Storage:
 *    - Output strictly saved into context.cacheDir/invoices/ for FileProvider sharing.
 */
object PdfGenerator {

    private const val PAGE_WIDTH = 595
    private const val PAGE_HEIGHT = 842

    // Dynamic QR Generator Function
    private fun generateUpiQrBitmap(upiUri: String, size: Int = 250): Bitmap? {
        return try {
            val bitMatrix = QRCodeWriter().encode(upiUri, BarcodeFormat.QR_CODE, size, size)
            val width = bitMatrix.width
            val height = bitMatrix.height
            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565)
            for (x in 0 until width) {
                for (y in 0 until height) {
                    bitmap.setPixel(x, y, if (bitMatrix.get(x, y)) Color.BLACK else Color.WHITE)
                }
            }
            bitmap
        } catch (e: Exception) {
            null
        }
    }

    // Dynamic Y calculation helper to prevent item overlap
    fun getDynamicPhotoY(itemsCount: Int): Float {
        val baseTableY = 206f
        val tableHeight = itemsCount * 24f
        val calculatedY = baseTableY + tableHeight + 80f // 80pt margin for totals
        return maxOf(calculatedY, 520f)
    }

    suspend fun generateInvoicePdf(context: Context, invoice: Invoice): File =
        withContext(Dispatchers.IO) {
            val pdfDoc = PdfDocument()
            val pageInfo = PdfDocument.PageInfo.Builder(PAGE_WIDTH, PAGE_HEIGHT, 1).create()
            val page = pdfDoc.startPage(pageInfo)
            val canvas = page.canvas

            canvas.drawColor(Color.WHITE)

            val headerPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(17, 28, 45)
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                textSize = 22f
            }

            val accentPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(20, 110, 245)
            }

            val textPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(55, 65, 81)
                textSize = 10f
            }

            canvas.drawRect(0f, 0f, PAGE_WIDTH.toFloat(), 8f, accentPaint)
            canvas.drawText("BOLOBILL INVOICE", 40f, 42f, headerPaint)

            val metaPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(100, 116, 139)
                textSize = 9.5f
            }
            canvas.drawText("Invoice #: ${invoice.invoiceNumber}", 40f, 58f, metaPaint)
            val dateFormat = SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault())
            canvas.drawText("Date: ${dateFormat.format(Date(invoice.createdAt))}", 40f, 72f, metaPaint)

            val techBox = RectF(PAGE_WIDTH - 220f, 25f, PAGE_WIDTH - 40f, 85f)
            val techBoxPaint = Paint().apply {
                color = Color.rgb(241, 245, 249)
                style = Paint.Style.FILL
            }
            canvas.drawRoundRect(techBox, 8f, 8f, techBoxPaint)

            val techTitlePaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(15, 23, 42)
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                textSize = 11f
            }
            canvas.drawText(invoice.technicianName, PAGE_WIDTH - 210f, 45f, techTitlePaint)
            canvas.drawText(invoice.technicianTrade, PAGE_WIDTH - 210f, 60f, metaPaint)
            canvas.drawText("UPI: ${invoice.technicianUpiId}", PAGE_WIDTH - 210f, 75f, metaPaint)

            val clientBox = RectF(40f, 98f, PAGE_WIDTH - 40f, 155f)
            val clientBoxPaint = Paint().apply {
                color = Color.rgb(248, 250, 252)
                style = Paint.Style.FILL
            }
            canvas.drawRoundRect(clientBox, 8f, 8f, clientBoxPaint)

            val clientTitlePaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(100, 116, 139)
                textSize = 8.5f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText("BILLED TO / सेवा प्राप्तकर्ता", 52f, 114f, clientTitlePaint)

            val clientNamePaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(15, 23, 42)
                textSize = 12f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText(invoice.clientName, 52f, 130f, clientNamePaint)
            canvas.drawText("${invoice.clientPhone} • ${invoice.clientAddress}", 52f, 145f, textPaint)

            var currentY = 180f
            val tableHeaderPaint = Paint().apply {
                color = Color.rgb(226, 232, 240)
                style = Paint.Style.FILL
            }
            canvas.drawRect(40f, currentY, PAGE_WIDTH - 40f, currentY + 22f, tableHeaderPaint)

            val colPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(30, 41, 59)
                textSize = 9f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText("SL", 50f, currentY + 14f, colPaint)
            canvas.drawText("ITEM DESCRIPTION / विवरण", 85f, currentY + 14f, colPaint)
            canvas.drawText("QTY", 360f, currentY + 14f, colPaint)
            canvas.drawText("RATE (₹)", 420f, currentY + 14f, colPaint)
            canvas.drawText("AMOUNT (₹)", 480f, currentY + 14f, colPaint)

            currentY += 26f

            val rowTextPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(51, 65, 85)
                textSize = 9.5f
            }
            val dividerPaint = Paint().apply {
                color = Color.rgb(241, 245, 249)
                strokeWidth = 1f
            }

            invoice.items.forEachIndexed { index, item ->
                canvas.drawText("${index + 1}", 50f, currentY + 14f, rowTextPaint)
                canvas.drawText(item.name, 85f, currentY + 14f, rowTextPaint)
                canvas.drawText("${item.quantity} ${item.unit}", 360f, currentY + 14f, rowTextPaint)
                canvas.drawText(String.format(Locale.ROOT, "%.2f", item.rate), 420f, currentY + 14f, rowTextPaint)
                canvas.drawText(String.format(Locale.ROOT, "%.2f", item.amount), 480f, currentY + 14f, rowTextPaint)

                canvas.drawLine(40f, currentY + 22f, PAGE_WIDTH - 40f, currentY + 22f, dividerPaint)
                currentY += 24f
            }

            currentY += 10f
            val totalBoxX = PAGE_WIDTH - 240f
            canvas.drawText("Subtotal:", totalBoxX, currentY, textPaint)
            canvas.drawText("₹ ${String.format(Locale.ROOT, "%.2f", invoice.subtotal)}", totalBoxX + 110f, currentY, textPaint)

            if (invoice.discount > 0) {
                currentY += 16f
                canvas.drawText("Discount:", totalBoxX, currentY, textPaint)
                canvas.drawText("- ₹ ${String.format(Locale.ROOT, "%.2f", invoice.discount)}", totalBoxX + 110f, currentY, textPaint)
            }

            currentY += 22f
            val grandTotalPaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(15, 23, 42)
                textSize = 14f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText("Total Payable:", totalBoxX, currentY, grandTotalPaint)
            val grandPricePaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(16, 185, 129)
                textSize = 15f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText("₹ ${String.format(Locale.ROOT, "%.2f", invoice.totalAmount)}", totalBoxX + 110f, currentY, grandPricePaint)

            if (!invoice.warrantyTerm.isNullOrEmpty() && invoice.warrantyTerm != "NO_WARRANTY") {
                val stampCenterX = 110f
                val stampCenterY = currentY - 15f
                drawCircularWarrantyStamp(canvas, stampCenterX, stampCenterY, invoice.warrantyTerm)
            }

            // Dynamically computed Y coordinate to prevent overlapping items
            val photoSectionY = getDynamicPhotoY(invoice.items.size)
            val photoSectionTitlePaint = Paint().apply {
                isAntiAlias = true
                color = Color.rgb(71, 85, 105)
                textSize = 9.5f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            }
            canvas.drawText("VERIFIED WORK PROOF / कार्य प्रमाण फोटो:", 40f, photoSectionY - 8f, photoSectionTitlePaint)

            val beforeBitmap = decodeSampledBitmapFromUri(context, invoice.beforePhotoUri, 160, 120)
            val photoBoxPaint = Paint().apply {
                color = Color.rgb(241, 245, 249)
                style = Paint.Style.FILL
            }
            val beforeRect = RectF(40f, photoSectionY, 160f, photoSectionY + 90f)
            canvas.drawRoundRect(beforeRect, 6f, 6f, photoBoxPaint)
            if (beforeBitmap != null) {
                canvas.drawBitmap(beforeBitmap, null, beforeRect, null)
            }
            drawPhotoCaption(canvas, "Work Before / कार्य से पहले", 40f, photoSectionY + 102f)

            val afterBitmap = decodeSampledBitmapFromUri(context, invoice.afterPhotoUri, 160, 120)
            val afterRect = RectF(180f, photoSectionY, 300f, photoSectionY + 90f)
            canvas.drawRoundRect(afterRect, 6f, 6f, photoBoxPaint)
            if (afterBitmap != null) {
                canvas.drawBitmap(afterBitmap, null, afterRect, null)
            }
            drawPhotoCaption(canvas, "Work Completed / कार्य सम्पन्न", 180f, photoSectionY + 102f)

            val qrBoxX = PAGE_WIDTH - 150f
            val qrBoxY = photoSectionY - 10f

            if (invoice.isPaid) {
                val paidBox = RectF(qrBoxX, qrBoxY, qrBoxX + 110f, qrBoxY + 110f)
                val paidBoxPaint = Paint().apply {
                    color = Color.rgb(240, 253, 244)
                    style = Paint.Style.FILL
                }
                val paidBorderPaint = Paint().apply {
                    color = Color.rgb(34, 197, 94)
                    style = Paint.Style.STROKE
                    strokeWidth = 1.5f
                }
                canvas.drawRoundRect(paidBox, 8f, 8f, paidBoxPaint)
                canvas.drawRoundRect(paidBox, 8f, 8f, paidBorderPaint)

                val paidReceiptTextPaint = Paint().apply {
                    isAntiAlias = true
                    color = Color.rgb(22, 101, 52)
                    textSize = 11f
                    typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                }
                canvas.drawText("PAYMENT", qrBoxX + 26f, qrBoxY + 38f, paidReceiptTextPaint)
                canvas.drawText("CLEARED", qrBoxX + 28f, qrBoxY + 54f, paidReceiptTextPaint)

                val clearDate = invoice.paidDate ?: System.currentTimeMillis()
                val clearDateStr = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(Date(clearDate))
                val dateLabelPaint = Paint().apply {
                    isAntiAlias = true
                    color = Color.rgb(74, 222, 128)
                    textSize = 8.5f
                }
                canvas.drawText(clearDateStr, qrBoxX + 28f, qrBoxY + 76f, dateLabelPaint)
            } else {
                val qrBox = RectF(qrBoxX, qrBoxY, qrBoxX + 110f, qrBoxY + 110f)
                val qrBgPaint = Paint().apply {
                    color = Color.rgb(248, 250, 252)
                    style = Paint.Style.FILL
                }
                canvas.drawRoundRect(qrBox, 8f, 8f, qrBgPaint)

                val upiUri = "upi://pay?pa=${invoice.technicianUpiId}&pn=${URLEncoder.encode(invoice.technicianName, "UTF-8")}&am=${invoice.totalAmount}&cu=INR&tn=Bill_${invoice.invoiceNumber}"
                val qrBitmap = generateUpiQrBitmap(upiUri, 200)

                if (qrBitmap != null) {
                    val qrDestRect = RectF(qrBoxX + 10f, qrBoxY + 10f, qrBoxX + 100f, qrBoxY + 100f)
                    canvas.drawBitmap(qrBitmap, null, qrDestRect, null)
                    val qrSubText = Paint().apply {
                        isAntiAlias = true
                        color = Color.rgb(71, 85, 105)
                        textSize = 7.5f
                        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                    }
                    canvas.drawText("SCAN TO PAY (UPI)", qrBoxX + 18f, qrBoxY + 102f, qrSubText)
                } else {
                    val qrTextPaint = Paint().apply {
                        isAntiAlias = true
                        color = Color.rgb(71, 85, 105)
                        textSize = 9f
                        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                    }
                    canvas.drawText("SCAN TO PAY", qrBoxX + 22f, qrBoxY + 58f, qrTextPaint)
                    val upiSubText = Paint().apply {
                        isAntiAlias = true
                        color = Color.rgb(100, 116, 139)
                        textSize = 7.5f
                    }
                    canvas.drawText("UPI / GooglePay / PhonePe", qrBoxX + 12f, qrBoxY + 76f, upiSubText)
                }
            }

            if (invoice.isPaid) {
                drawPaidWatermark(canvas)
            }

            pdfDoc.finishPage(page)

            val outputDir = File(context.cacheDir, "invoices").apply { if (!exists()) mkdirs() }
            val outputFile = File(outputDir, "Invoice_${invoice.invoiceNumber}.pdf")
            FileOutputStream(outputFile).use { out ->
                pdfDoc.writeTo(out)
            }
            pdfDoc.close()

            return@withContext outputFile
        }

    private fun drawCircularWarrantyStamp(canvas: Canvas, cx: Float, cy: Float, warrantyTerm: String) {
        val daysCount = when (warrantyTerm) {
            "15_DAYS" -> "15"
            "30_DAYS" -> "30"
            "90_DAYS" -> "90"
            else -> "30"
        }

        val radius = 48f
        val stampPaint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(14, 116, 144)
            style = Paint.Style.STROKE
            strokeWidth = 2.5f
        }
        canvas.drawCircle(cx, cy, radius, stampPaint)

        val innerCirclePaint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(6, 182, 212)
            style = Paint.Style.STROKE
            strokeWidth = 1f
            pathEffect = DashPathEffect(floatArrayOf(4f, 3f), 0f)
        }
        canvas.drawCircle(cx, cy, radius - 6f, innerCirclePaint)

        val textPath = Path().apply {
            addCircle(cx, cy, radius - 14f, Path.Direction.CW)
        }
        val arcTextPaint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(14, 116, 144)
            textSize = 6.2f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            letterSpacing = 0.08f
        }
        canvas.drawTextOnPath("BOLOBILL VERIFIED • SERVICE GUARANTEE", textPath, 18f, 0f, arcTextPaint)

        val daysNumberPaint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(8, 145, 178)
            textSize = 15f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        canvas.drawText(daysCount, cx - 8f, cy + 2f, daysNumberPaint)

        val daysSubPaint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(71, 85, 105)
            textSize = 6.5f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        canvas.drawText("DAYS WARRANTY", cx - 24f, cy + 12f, daysSubPaint)
    }

    private fun drawPaidWatermark(canvas: Canvas) {
        canvas.save()
        canvas.rotate(-35f, PAGE_WIDTH / 2f, PAGE_HEIGHT / 2f)

        val watermarkPaint = Paint().apply {
            isAntiAlias = true
            color = Color.argb(42, 22, 163, 74)
            textSize = 54f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }

        val hindiWatermarkPaint = Paint().apply {
            isAntiAlias = true
            color = Color.argb(38, 22, 163, 74)
            textSize = 22f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }

        val borderPaint = Paint().apply {
            isAntiAlias = true
            color = Color.argb(48, 22, 163, 74)
            style = Paint.Style.STROKE
            strokeWidth = 4f
        }

        val rectWidth = 420f
        val rectHeight = 84f
        val rectLeft = (PAGE_WIDTH - rectWidth) / 2f
        val rectTop = (PAGE_HEIGHT - rectHeight) / 2f
        val stampRect = RectF(rectLeft, rectTop, rectLeft + rectWidth, rectTop + rectHeight)

        canvas.drawRoundRect(stampRect, 16f, 16f, borderPaint)
        canvas.drawText("PAID", rectLeft + 54f, rectTop + 58f, watermarkPaint)
        canvas.drawText("पूर्ण भुगतान प्राप्त", rectLeft + 200f, rectTop + 52f, hindiWatermarkPaint)

        canvas.restore()
    }

    private fun drawPhotoCaption(canvas: Canvas, caption: String, x: Float, y: Float) {
        val paint = Paint().apply {
            isAntiAlias = true
            color = Color.rgb(100, 116, 139)
            textSize = 7.5f
        }
        canvas.drawText(caption, x, y, paint)
    }

    private fun decodeSampledBitmapFromUri(context: Context, uriString: String?, reqWidth: Int, reqHeight: Int): Bitmap? {
        if (uriString.isNullOrEmpty()) return null
        return try {
            val uri = Uri.parse(uriString)
            val stream = if (uri.scheme == "file") {
                File(uri.path ?: "").inputStream()
            } else {
                context.contentResolver.openInputStream(uri)
            } ?: return null

            val bytes = stream.readBytes()
            val options = BitmapFactory.Options().apply { inJustDecodeBounds = true }
            BitmapFactory.decodeByteArray(bytes, 0, bytes.size, options)

            options.inSampleSize = PhotoPickerHelper.calculateInSampleSize(options, reqWidth, reqHeight)
            options.inJustDecodeBounds = false

            val rawBitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size, options)
            if (rawBitmap != null) {
                PhotoPickerHelper.rotateBitmapIfRequired(rawBitmap, bytes)
            } else {
                null
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}
