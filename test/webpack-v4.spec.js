const assert = require('assert')
const path = require('path')
const MemoryFileSystem = require('memory-fs');

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HtmlWebpackPreconnectPlugin = require('../index')

describe('preconnect - webpack 4', function() {
  it('add preconnect tags', function(done) {
    const compiler = webpack({
      entry: path.join(__dirname, '../example/index.js'),
      output: {
        path: path.join(__dirname, 'dist')
      },
      plugins: [
        new HtmlWebpackPlugin({
          preconnect: [
            'http://api1.example.com',
            'https://fonts.gstatic.com',
          ],
        }),
        new HtmlWebpackPreconnectPlugin(),
      ]
    }, function(err, result) {
      if (err) {
        done(err)
      }
      if (result.compilation.errors && result.compilation.errors.length) {
        done(result.compilation.errors)
      }

      const html = result.compilation.assets['index.html'].source();
      assert.equal(typeof html, 'string')
      assert.ok(html.includes('<link rel="preconnect" href="http://api1.example.com"'))
      assert.ok(html.includes('<link rel="preconnect" href="https://fonts.gstatic.com"'))

      done()
    })
    compiler.outputFileSystem = new MemoryFileSystem()
  })
})
