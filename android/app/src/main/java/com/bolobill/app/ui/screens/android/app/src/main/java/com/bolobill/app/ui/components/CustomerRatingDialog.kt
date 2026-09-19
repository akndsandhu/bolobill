package com.bolobill.app.ui.components

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarBorder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun CustomerRatingDialog(
    context: Context,
    shopName: String,
    initialRating: Int = 5,
    onDismiss: () -> Unit,
    onSubmitReview: (stars: Int, feedback: String) -> Unit
) {
    var rating by remember { mutableStateOf(initialRating) }
    var feedbackText by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Column {
                Text("काम की रेटिंग और समीक्षा", fontWeight = FontWeight.Bold)
                Text(
                    text = "$shopName के काम से आप कितने संतुष्ट हैं?",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.outline
                )
            }
        },
        text = {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                // Interactive 5 Star Row
                Row(
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    for (i in 1..5) {
                        val isSelected = i <= rating
                        Icon(
                            imageVector = if (isSelected) Icons.Default.Star else Icons.Outlined.StarBorder,
                            contentDescription = "Star $i",
                            tint = if (isSelected) Color(0xFFF59E0B) else Color(0xFFCBD5E1),
                            modifier = Modifier
                                .size(42.dp)
                                .clickable { rating = i }
                        )
                    }
                }

                Text(
                    text = when (rating) {
                        5 -> "⭐⭐⭐⭐⭐ बेहतरीन काम! (Excellent)"
                        4 -> "⭐⭐⭐⭐ बहुत अच्छा (Very Good)"
                        3 -> "⭐⭐⭐ ठीक-ठाक (Average)"
                        else -> "सुधार की आवश्यकता है (Needs Improvement)"
                    },
                    fontWeight = FontWeight.SemiBold,
                    color = if (rating >= 4) Color(0xFF16A34A) else Color(0xFFEA580C),
                    fontSize = 13.sp
                )

                OutlinedTextField(
                    value = feedbackText,
                    onValueChange = { feedbackText = it },
                    label = { Text("ग्राहक की राय (Optional Note)") },
                    placeholder = { Text("काम समय पर और बढ़िया हुआ...") },
                    modifier = Modifier.fillMaxWidth(),
                    maxLines = 3
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    onSubmitReview(rating, feedbackText)
                    // 5-स्टार रेटिंग पर अगर दुकानदार का Google Maps लिंक है तो ओपन कर सकते हैं
                    onDismiss()
                },
                shape = RoundedCornerShape(10.dp)
            ) {
                Text("रेटिंग सबमिट करें")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("बाद में")
            }
        }
    )
}
