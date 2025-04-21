/**
 * Represents a single node within the trie.
 * @class
 */
class TrieNode {
    constructor() {
    /** @type {Object<string, TrieNode>} */
      this.children = {};
    /** @type {Set<string>} */
      this.ids = new Set();
    /** @type {boolean} */
      this.isWord = false;
    }
  }
  
  /**
 * Trie data structure for prefix-based lookups.
 * @class
 */
  class Trie {
    constructor() {
      /** @type {TrieNode} */
      this.root = new TrieNode();
    }
  /**
   * Insert a word into the trie, associating every prefix node with the given ID.
   * @param {string} word - The word to insert (e.g. a lower‑cased name).
   * @param {string} id   - The Profile.id (UUID) to record at each prefix.
   */  
    insert(word, id) {
      let node = this.root;
      for (const letter of word) {
        if (!node.children[letter]) node.children[letter] = new TrieNode();
        
        node = node.children[letter];
        node.ids.add(id);
      }
      node.isWord = true;
    }
  /**
   * Retrieve all IDs of profiles whose inserted words start with the given prefix.
   * @param {string} prefix
   * @returns {string[]} Array of Profile.id values matching the prefix.
   */  
    startsWith(prefix) {
      let node = this.root;
      for (const letter of prefix) {
        if (!node.children[letter]) return [];
        node = node.children[letter];
      }
      return Array.from(node.ids);
    }
  }
  
  module.exports = { Trie };