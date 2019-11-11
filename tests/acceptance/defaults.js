/* globals fixture, test */

import { Selector } from 'testcafe'

fixture('Metadata checks').page('http://localhost:1234/')

test('Verify title updated', async t => {
  await t
    .expect(Selector('.headline').textContent)
    .notContains('Title Goes Here', 'update headline in metadata/meta.json')
})

test('Verify subhead updated', async t => {
  await t
    .expect(Selector('.subhead').textContent)
    .notContains('Subhead goes here', 'update subhead in metadata/meta.json')
})

test('Verify byline updated', async t => {
  await t
    .expect(Selector('.byline').textContent)
    .notContains('Jonathan Soma', 'update byline in metadata/meta.json')
})

test('Verify date updated', async t => {
  await t
    .expect(Selector('.date').textContent)
    .notContains('1970', 'update date in metadata/meta.json')
})

test('Verify kicker updated', async t => {
  await t
    .expect(Selector('.kicker').textContent)
    .notContains('Little Columns', 'update kicker in metadata/meta.json')
})
