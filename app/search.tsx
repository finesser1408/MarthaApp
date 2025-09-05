import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { isSmallScreen } from '../utils/responsive';
import { ALL_PRODUCTS } from '../constants/catalog';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = 'recent_searches_v1';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as string[];
          if (Array.isArray(parsed)) setRecents(parsed);
        }
      } catch {}
    })();
  }, []);

  const persistRecents = async (items: string[]) => {
    setRecents(items);
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items.slice(0, 10)));
    } catch {}
  };

  const addRecent = async (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recents.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 10);
    await persistRecents(next);
  };

  const clearRecents = async () => {
    await persistRecents([]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, isSmallScreen && { paddingTop: 8, paddingHorizontal: 12, paddingBottom: 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={isSmallScreen ? 22 : 24} color="#2A4D50" />
        </TouchableOpacity>
        <View style={[styles.searchInputWrapper, isSmallScreen && { height: 40, paddingHorizontal: 10, gap: 6 }]}>
          <Ionicons name="search" size={isSmallScreen ? 16 : 18} color="#7C7C7C" />
          <TextInput
            style={[styles.searchInput, isSmallScreen && { fontSize: 14 }]}
            placeholder="Search products or stores"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={async () => {
              await addRecent(query);
            }}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={isSmallScreen ? 16 : 18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.body, isSmallScreen && { padding: 16 }]}>
        {query.trim().length === 0 ? (
          <View>
            <View style={styles.recentsHeader}>
              <Text style={styles.recentsTitle}>Recent searches</Text>
              {recents.length > 0 && (
                <TouchableOpacity onPress={clearRecents}>
                  <Text style={styles.clearButton}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            {recents.length === 0 ? (
              <Text style={styles.helperText}>Start typing to search…</Text>
            ) : (
              <FlatList
                data={recents}
                keyExtractor={(item, idx) => `${item}-${idx}`}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.recentRow}
                    onPress={async () => {
                      setQuery(item);
                      await addRecent(item);
                    }}
                  >
                    <Ionicons name="time-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                    <Text style={styles.recentText}>{item}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.resultsContainer}
              />
            )}
          </View>
        ) : (
          <FlatList
            data={ALL_PRODUCTS.filter(p =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              (p.category?.toLowerCase() || '').includes(query.toLowerCase())
            )}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.resultRow, isSmallScreen && { paddingVertical: 10 }]}
                onPress={async () => {
                  await addRecent(item.name);
                  router.push({
                    pathname: '/product',
                    params: {
                      product: JSON.stringify({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        unit: item.unit,
                        rating: item.rating,
                        imageKey: item.imageKey,
                      }),
                    },
                  });
                }}
              >
                <Image source={item.image} style={[styles.thumb, isSmallScreen && { width: 40, height: 40 }]} />
                <View style={styles.resultInfo}>
                  <Text style={[styles.resultName, isSmallScreen && { fontSize: 14 }]}>{item.name}</Text>
                  <Text style={[styles.resultMeta, isSmallScreen && { fontSize: 12 }]}>
                    {item.category ?? 'Product'} • ${item.price.toFixed(2)}/{item.unit}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.helperText}>No local results for "{query}"</Text>
            )}
            contentContainerStyle={styles.resultsContainer}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
  body: {
    flex: 1,
    padding: 20,
  },
  helperText: {
    color: '#6B7280',
  },
  resultsContainer: {
    paddingVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  resultMeta: {
    marginTop: 2,
    color: '#6B7280',
  },
  recentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  clearButton: {
    color: '#10B981',
    fontWeight: '600',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  recentText: {
    color: '#111827',
    fontSize: 15,
  },
});
