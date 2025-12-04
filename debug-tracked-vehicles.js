// Debug script to check tracked vehicles in Firestore
// Run this in browser console on your app to debug

console.log('🔍 Debugging Tracked Vehicles...');

// Check if user is authenticated
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();
const user = auth.currentUser;

if (!user) {
  console.error('❌ No user logged in');
} else {
  console.log('✅ User logged in:', user.uid);
  
  // Try simple query without orderBy first
  console.log('🔍 Checking trackedVehicles collection...');
  
  const simpleQuery = query(
    collection(db, 'trackedVehicles'),
    where('userId', '==', user.uid)
  );
  
  getDocs(simpleQuery).then(snapshot => {
    console.log('📊 Total documents found:', snapshot.size);
    
    if (snapshot.empty) {
      console.log('💡 No tracked vehicles found. This could mean:');
      console.log('   1. No vehicles have been tracked yet');
      console.log('   2. Data is in different collection');
      console.log('   3. userId field doesn\'t match');
    } else {
      console.log('📋 Tracked vehicles data:');
      snapshot.forEach(doc => {
        console.log('Document ID:', doc.id);
        console.log('Data:', doc.data());
        console.log('---');
      });
    }
    
    // Now try with orderBy
    console.log('🔍 Testing orderBy query...');
    const orderByQuery = query(
      collection(db, 'trackedVehicles'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );
    
    return getDocs(orderByQuery);
  }).then(orderedSnapshot => {
    console.log('📊 OrderBy query results:', orderedSnapshot.size);
    if (orderedSnapshot.size === 0) {
      console.log('⚠️  OrderBy query failed - might need Firestore index');
      console.log('📋 Create this index in Firestore:');
      console.log('   Collection: trackedVehicles');
      console.log('   Fields: userId (Ascending), updatedAt (Descending)');
    }
  }).catch(error => {
    console.error('❌ Query error:', error);
    if (error.code === 'failed-precondition') {
      console.log('🔧 SOLUTION: Create Firestore index');
      console.log('   1. Go to Firebase Console');
      console.log('   2. Go to Firestore Database');
      console.log('   3. Go to Indexes tab');
      console.log('   4. Create composite index:');
      console.log('      Collection: trackedVehicles');
      console.log('      Field 1: userId (Ascending)');
      console.log('      Field 2: updatedAt (Descending)');
    }
  });
}