;(function () {
  /**
   * Hash description helper
   * @param {String} key  Hash slug before options block
   * @param {Object} opts Options attached to hash
   */
  function HashObject (key, opts) {
    this.key = key
    this.opts = {}

    // Split opts at commas
    opts = (opts || '').split(',')

    // Add each option
    for (var i = 0; i < opts.length; i++) {
      // Split at equals, or assume true
      var parts = opts[i].split('=')
      this.opts[parts.shift()] = parts.length ? parts.shift() : true
    }
  }

  /**
   * Get option value
   * @param  {String} key Option key
   * @return {String}     Option value
   */
  HashObject.prototype.get = function (key) {
    return this.opts[key]
  }

  /**
   * Get truthiness of option
   * @param  {String}  key Option key
   * @return {Boolean}     Option truthiness
   */
  HashObject.prototype.is = function (key) {
    return !!this.get(key)
  }

  /**
   * Create an instance of Hush
   * @param {Object} map Map of hash slugs and values
   */
  function Hush (map) {
    this.map = map || {}
  }

  /**
   * Add a new hash slug with associated value
   * @param {String}   key   Hash slug
   * @param {Function} value Value to associate with slug
   */
  Hush.prototype.add = function (key, value) {
    this.map[key] = value
    return this
  }

  /**
   * Get value associated with hash slug
   * @param  {String} key Hash slug
   * @return {mixed}      Value associated with slug
   */
  Hush.prototype.get = function (key) {
    return this.map[key]
  }

  /*****************
   * Class methods *
   *****************/

  /**
   * Navigate to url
   * @param  {String} url  Base URL to navigate to
   * @param  {Mixed}  data Data object to serialize and append
   * @return {String}      Final URL navigated to
   */
  Hush.navigate = function (url, data) {
    return location = url + (data ? this.serialize(data) : '')
  }

  /**
   * Serialize object to data block
   * @param  {Object} data Object to serialize
   * @return {String}      Data block
   */
  Hush.serialize = function (data) {
    var values = []
    for (var i in data) {
      values.push(i + (data[i] === true ? '' : '=' + data[i]))
    }
    return '['+values.join(',')+']'
  }

  /**
   * Parse hash slug string
   * @param  {String}     hash Hash slug string
   * @return {HashObject}      HashObject to simplify interaction
   */
  Hush.parse = function (hash) {
    var parts = hash.match(/#([^\[]*)(\[(.*)\])?/) || ['','','','']
    return new HashObject(parts[1], parts[3])
  }

  /**
   * Start hashchange listener and navigate to current matching hash
   * @param  {Function} fn Callback to execute whenever a hash change occurs
   */
  Hush.start = function (fn) {
    window.onhashchange = function () {
      fn(Hush.parse(location.hash))
    }
    fn(Hush.parse(location.hash))
  }

  // Export
  this.Hush = Hush
}).call(this)