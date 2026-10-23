import { processTextForEmoji, getAttrs } from 'src/services/html_converter/utility.service.js'

describe('html_converter utility', () => {
  describe('processTextForEmoji', () => {
    it('processes all emoji in text', () => {
      const input = 'Hello from finland! :lol: We have best water! :lmao:'
      const emojis = [
        { shortcode: 'lol', src: 'LOL' },
        { shortcode: 'lmao', src: 'LMAO' }
      ]
      const processor = ({ shortcode, src }) => ({ shortcode, src })
      expect(processTextForEmoji(input, emojis, processor)).to.eql([
        'Hello from finland! ',
        { shortcode: 'lol', src: 'LOL' },
        ' We have best water! ',
        { shortcode: 'lmao', src: 'LMAO' }
      ])
    })
    it('leaves text as is', () => {
      const input = 'Number one: that\'s terror'
      const emojis = []
      const processor = ({ shortcode, src }) => ({ shortcode, src })
      expect(processTextForEmoji(input, emojis, processor)).to.eql([
        'Number one: that\'s terror'
      ])
    })
  })

  describe('getAttrs', () => {
    it('extracts arguments from tag', () => {
      const input = '<img src="boop" cool ebin=\'true\'>'
      const output = { src: 'boop', cool: true, ebin: 'true' }

      expect(getAttrs(input)).to.eql(output)
    })

    it('decodes entities only after quotes have delimited the value', () => {
      const input = '<a href="https://example.com/?a=1&amp;b=2" title=\'Tom &amp; Jerry&#39;s &quot;cafe&quot;\'>'
      expect(getAttrs(input, () => true)).to.eql({
        href: 'https://example.com/?a=1&b=2',
        title: 'Tom & Jerry\'s "cafe"'
      })
    })

    it('does not turn encoded quotes inside a value into extra attributes', () => {
      const input = '<span title="alpha&quot; data-extra=&quot;beta">'
      const attrs = getAttrs(input, () => true)

      expect(Object.keys(attrs)).to.eql(['title'])
      expect(attrs.title).to.eql('alpha" data-extra="beta')
    })
  })
})
