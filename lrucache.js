/**
 * LRU Cache implementation in JavaScript.
 * Copyright © 2015 Matthew Fornaciari (mattforni@gmail.com)
 */
function LRUCache(maxSize) {
    var lruCache = this;

    // Private variables
    var _cache = {}; // A map of key to node
    var _head = null;
    var _tail = null;
    var _maxSize = (typeof maxSize === 'number') ? maxSize : 10
    var _size = 0;

    // Private objects
    function Node(key, data, ttl) {
        var node = this;

        // Public variables
        this.data = data;
        this.previous = null;
        this.next = _head;

        // Private variables
        var _expiresAt = (typeof ttl === 'number') ? new Date().getTime() + ttl : null;

        // Public methods
        this.getKey = function() { return key; }

        this.isExpired = function() {
            return (_expiresAt !== null) ? _expiresAt < new Date().getTime() : false;
        };

        this.touch = function(ttl) {
            // Update the expirary if it has been provided and is a number
            if (typeof ttl === 'number') { _expiresAt = new Date().getTime() + ttl; }

            if (node.previous === null) { return; } // If the node is already the head, do nothing

            node.previous.next = node.next;

            // If the node is at the tail, update the reference to _tail
            if (node.next === null) {
                _tail = node.previous; 
            } else { // Else just update the next node's reference to previous
                node.next.previous = node.previous;
            }

            // Move the node to the front of the queue
            node.previous = null;
            node.next = _head;
            _head.previous = node;
            _head = node;
        }
    }

    // Public methods
    this.set = function(key, data, ttl) {
        if (key === undefined || data === undefined) { return; } // If key or data are not provided, do nothing

        // If the cache already contains a node with the given key, update the data
        if (_cache.hasOwnProperty(key)) {
            var node = _cache[key];
            node.data = data;
            node.touch(ttl);
            return;
        }

        if (_size >= _maxSize) { evict(); } // If the cache is full, evict the last used element

        var node = new Node(key, data, ttl);
        if (_head !== null) { _head.previous = node; } // If _head is not null, update it's reference to previous
        _head = node; // Update the reference to _head
        if (_tail === null) { _tail = node; } // If this is the first element set _tail as well as _head
        _cache[key] = node; // Update the cache for quick searching
        _size++; // Increment the size of the cache
    };

    this.get = function(key) {
        if (!_cache.hasOwnProperty(key)) { return null; } // If the key is not in the cache, return null
        var node = _cache[key];
        node.touch();
        return node;
    };

    // Private methods
    var evict = function() {
        if (_size === 0) { return; } // If the cache is empty, do nothing

        var previous = _tail.previous;
        if (previous !== null) { previous.next = null; } // Update the node before _tail if it exists
        delete _cache[_tail.getKey()]; // Delete the node from the cache
        _tail = previous; // Update the reference to _tail, even if it is null
        _size--; // Decrement the size of the cache
        if (_size === 0) { _head = null; } // If the cache is now empty also update the reference to _head
    };
}

