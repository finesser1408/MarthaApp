import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useReviews } from '../context/ReviewsContext';

export default function ReviewsScreen() {
  const router = useRouter();
  const { productId: productIdParam, productName: productNameParam } = useLocalSearchParams<{ productId?: string; productName?: string }>();
  const productId = useMemo(() => String(productIdParam || ''), [productIdParam]);
  const productName = useMemo(() => String(productNameParam || 'Product'), [productNameParam]);
  const { getReviews, addReview } = useReviews();

  const reviews = getReviews(productId);

  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = () => {
    const r = Number(rating);
    if (!author.trim() || !comment.trim() || !r || r < 1 || r > 5) {
      setError('Please enter your name, a rating between 1 and 5, and a comment.');
      return;
    }
    if (!productId) {
      setError('Missing product context.');
      return;
    }
    setError('');
    setSubmitting(true);
    setTimeout(() => {
      addReview(productId, author, r, comment);
      setSubmitting(false);
      setAuthor('');
      setRating('');
      setComment('');
      const msg = 'Review submitted successfully';
      if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
      else Alert.alert('Success', msg);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2A4D50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews • {productName}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Write a review</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.label}>Your name</Text>
          <TextInput
            value={author}
            onChangeText={setAuthor}
            placeholder="e.g. Tariro"
            placeholderTextColor="#9E9E9E"
            style={styles.input}
          />

          <Text style={styles.label}>Rating (1-5)</Text>
          <TextInput
            value={rating}
            onChangeText={(t) => setRating(t.replace(/[^0-9]/g, '').slice(0, 1))}
            keyboardType="number-pad"
            placeholder="5"
            placeholderTextColor="#9E9E9E"
            style={styles.input}
          />

          <Text style={styles.label}>Comment</Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Share your experience..."
            placeholderTextColor="#9E9E9E"
            style={[styles.input, styles.textarea]}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={[styles.submitButton, (!author.trim() || !comment.trim() || !rating) && { opacity: 0.6 }]}
            onPress={submit}
            disabled={submitting || !author.trim() || !comment.trim() || !rating}
          >
            <Text style={styles.submitText}>{submitting ? 'Submitting...' : 'Submit Review'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 12 }} />

        <View style={styles.list}>
          <Text style={styles.sectionTitle}>Recent reviews</Text>
          {reviews.length === 0 ? (
            <Text style={styles.emptyText}>No reviews yet. Be the first to review!</Text>
          ) : (
            reviews.map((rev) => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewer}>{rev.author}</Text>
                  <View style={styles.stars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < rev.rating ? 'star' : 'star-outline'}
                        size={14}
                        color="#FFD700"
                        style={{ marginLeft: 2 }}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.comment}>{rev.comment}</Text>
                <Text style={styles.meta}>{new Date(rev.createdAt).toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#2A4D50' },
  content: { padding: 20, paddingBottom: 40 },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2A4D50', marginBottom: 12 },
  label: { fontSize: 14, color: '#2A4D50', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    color: '#2A4D50',
    backgroundColor: '#FFFFFF',
  },
  textarea: { height: 110, textAlignVertical: 'top' },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: { color: '#FFFFFF', fontWeight: '700' },
  errorText: { color: '#D32F2F', marginBottom: 8 },
  list: { marginTop: 8 },
  emptyText: { color: '#7C7C7C' },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewer: { fontWeight: '700', color: '#2A4D50' },
  stars: { flexDirection: 'row' },
  comment: { color: '#2A4D50', marginTop: 2 },
  meta: { color: '#9E9E9E', fontSize: 12, marginTop: 6 },
});
