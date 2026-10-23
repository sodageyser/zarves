import { convertHtmlToTree } from 'src/services/html_converter/html_tree_converter.service.js'
import { getAttrs } from 'src/services/html_converter/utility.service.js'

describe('html_tree_converter', () => {
  describe('convertHtmlToTree', () => {
    it('converts html into a tree structure', () => {
      const input = '1 <p>2</p> <b>3<img src="a">4</b>5'
      expect(convertHtmlToTree(input)).to.eql([
        '1 ',
        [
          '<p>',
          ['2'],
          '</p>'
        ],
        ' ',
        [
          '<b>',
          [
            '3',
            ['<img src="a">'],
            '4'
          ],
          '</b>'
        ],
        '5'
      ])
    })
    it('converts html to tree while preserving tag formatting', () => {
      const input = '1 <p >2</p><b >3<img   src="a">4</b>5'
      expect(convertHtmlToTree(input)).to.eql([
        '1 ',
        [
          '<p >',
          ['2'],
          '</p>'
        ],
        [
          '<b >',
          [
            '3',
            ['<img   src="a">'],
            '4'
          ],
          '</b>'
        ],
        '5'
      ])
    })
    it('converts semi-broken html', () => {
      const input = '1 <br> 2 <p> 42'
      expect(convertHtmlToTree(input)).to.eql([
        '1 ',
        ['<br>'],
        ' 2 ',
        [
          '<p>',
          [' 42']
        ]
      ])
    })
    it('realistic case 1', () => {
      const input = '<p><span class="h-card"><a class="u-url mention" data-user="9wRC6T2ZZiKWJ0vUi8" href="https://cawfee.club/users/benis" rel="ugc">@<span>benis</span></a></span> <span class="h-card"><a class="u-url mention" data-user="194" href="https://shigusegubu.club/users/hj" rel="ugc">@<span>hj</span></a></span> nice</p>'
      expect(convertHtmlToTree(input)).to.eql([
        [
          '<p>',
          [
            [
              '<span class="h-card">',
              [
                [
                  '<a class="u-url mention" data-user="9wRC6T2ZZiKWJ0vUi8" href="https://cawfee.club/users/benis" rel="ugc">',
                  [
                    '@',
                    [
                      '<span>',
                      [
                        'benis'
                      ],
                      '</span>'
                    ]
                  ],
                  '</a>'
                ]
              ],
              '</span>'
            ],
            ' ',
            [
              '<span class="h-card">',
              [
                [
                  '<a class="u-url mention" data-user="194" href="https://shigusegubu.club/users/hj" rel="ugc">',
                  [
                    '@',
                    [
                      '<span>',
                      [
                        'hj'
                      ],
                      '</span>'
                    ]
                  ],
                  '</a>'
                ]
              ],
              '</span>'
            ],
            ' nice'
          ],
          '</p>'
        ]
      ])
    })
    it('keeps encoded quotes inside the opening tag and does not split them into attributes', () => {
      const opener = '<a class="u-url mention" href="https://example.com/users/a?x=1&amp;y=2" title="alpha&quot; data-extra=&quot;beta">'
      const input = opener + '@<span>a</span></a>'
      const tree = convertHtmlToTree(input)

      expect(tree[0][0]).to.eql(opener)
      expect(getAttrs(tree[0][0], () => true)).to.eql({
        class: 'u-url mention',
        href: 'https://example.com/users/a?x=1&y=2',
        title: 'alpha" data-extra="beta'
      })
    })

    it('leaves text nodes encoded for the rich content unescape path', () => {
      const input = '<p>Testing &#39;em all</p>'
      expect(convertHtmlToTree(input)).to.eql([
        [
          '<p>',
          ['Testing &#39;em all'],
          '</p>'
        ]
      ])
    })

    it('keeps void-tag markup encoded and decodes attribute values when read', () => {
      const opener = '<img alt="Tom &amp; Jerry" src="https://example.com/a.png?x=1&amp;y=2">'
      expect(convertHtmlToTree(opener)).to.eql([[opener]])
      expect(getAttrs(opener, () => true)).to.eql({
        alt: 'Tom & Jerry',
        src: 'https://example.com/a.png?x=1&y=2'
      })
    })

    it('realistic case 2', () => {
      const inputOutput = 'Country improv: give me a city<br/>Audience: Memphis<br/>Improv troupe: come on, a better one<br/>Audience: el paso'
      expect(convertHtmlToTree(inputOutput)).to.eql([
        'Country improv: give me a city',
        [
          '<br/>'
        ],
        'Audience: Memphis',
        [
          '<br/>'
        ],
        'Improv troupe: come on, a better one',
        [
          '<br/>'
        ],
        'Audience: el paso'
      ])
    })
  })
})
