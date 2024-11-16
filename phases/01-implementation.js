class KeyValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {
  constructor(numBuckets = 8) {
    this.capacity = numBuckets;
    this.data = new Array(this.capacity).fill(null); // Initialize with null
    this.count = 0; // No items yet
  }

  hash(key) {
    let hashValue = 0;
    for (let i = 0; i < key.length; i++) {
      hashValue += key.charCodeAt(i);
    }
    return hashValue;
  }

  hashMod(key) {
    return this.hash(key) % this.capacity; // Get the index using modulus
  }

  insert(key, value) {
    // Check if resizing is needed based on load factor
    if (this.count / this.capacity >= 0.7) {
      this.resize(); // Resize if load factor exceeds 0.7
    }
  
    const index = this.hashMod(key); // Calculate the index using the hash function
    let current = this.data[index]; // Get the current value at this index
  
    if (current === null) {
      // No collision, directly insert the key-value pair
      this.data[index] = new KeyValuePair(key, value);
      this.count++; // Increment the count
    } else {
      // Handle collisions (linked list)
      while (current !== null) {
        if (current.key === key) {
          // Key already exists, update the value
          current.value = value;
          return; // Exit after updating value
        }
        if (current.next === null) {
          // If at the end of the chain, append a new pair
          current.next = new KeyValuePair(key, value);
          this.count++; // Increment the count
          return;
        }
        current = current.next; // Move to the next node in the chain
      }
    }
  }
  

  read(key) {
    const index = this.hashMod(key); // Get the index using the hash function
    let current = this.data[index]; // Get the current node at this index
  
    // Step 1: Traverse the linked list to find the key
    while (current !== null) {
      if (current.key === key) {
        return current.value; // Return the value if the key is found
      }
      current = current.next; // Move to the next node in the chain
    }
  
    // Step 2: If the key is not found, return undefined
    return undefined;
  }
  resize() {
    const oldData = this.data; // Preserve the old data for redistribution
    this.capacity *= 2; // Double the capacity
    this.data = new Array(this.capacity).fill(null); // Create a new array with the new capacity
    this.count = 0; // Reset the count (we will update it as we insert)
  
    // Rehash and directly insert all key-value pairs from the old table into the new table
    for (let i = 0; i < oldData.length; i++) {
      let current = oldData[i];
      while (current !== null) {
        const newIndex = this.hashMod(current.key); // Rehash the key to get the new index
  
        let newPair = new KeyValuePair(current.key, current.value);
        let bucket = this.data[newIndex]; // Check for existing chain at the new index
  
        // Handle collisions by chaining at the new index (linked list)
        if (bucket === null) {
          // No collision, place the pair directly
          this.data[newIndex] = newPair;
        } else {
          // Collision, append to the linked list at this index
          let last = bucket;
          while (last.next !== null) {
            last = last.next; // Find the last node
          }
          last.next = newPair; // Add new pair at the end of the chain
        }
  
        this.count++; // Update the count as we're reinserting the items
        current = current.next; // Move to the next node in the old chain
      }
    }
  }

  delete(key) {
    const index = this.hashMod(key); // Get index for key
    let current = this.data[index]; // Get current value at that index
    let prev = null; // To track previous node for removal

    // Traverse the chain to find and delete the key-value pair
    while (current !== null) {
      if (current.key === key) {
        if (prev === null) {
          // Removing the first item in the chain
          this.data[index] = current.next;
        } else {
          prev.next = current.next; // Removing the item from the chain
        }
        this.count--; // Decrement count
        return; // Successfully deleted
      }
      prev = current; // Move to the next item
      current = current.next; // Move to the next item in the chain
    }

    // If key is not found, return a "Key not found" message
    return 'Key not found';
  }
}

module.exports = HashTable;
