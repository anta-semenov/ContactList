import * as faker from 'faker'
import * as fs from 'fs'
import * as path from 'path'

const generateContacts = () => {
  const avatarsRaw = fs.readdirSync(path.resolve('./src/data/avatars'))
    .filter((file) => /^[\sA-za-z]+\.png$/.test(file))

  let contactsTS = 'import { ImageRequireSource } from \'react-native\'\n\n'
  contactsTS += 'export interface ContactData {\n'
  contactsTS += '  avatar: ImageRequireSource\n'
  contactsTS += '  name: string\n'
  contactsTS += '  job: string\n'
  contactsTS += '  bio: string\n'
  contactsTS += '}\n\n'
  contactsTS += 'export const contacts: ContactData[] = [\n'
  avatarsRaw.forEach((file) => {
    contactsTS += '  {\n'
    contactsTS += `    avatar: require('./avatars/${file}'),\n`
    contactsTS += `    name: '${file.split('.')[0]}',\n`
    contactsTS += `    job: '${faker.name.jobTitle()}',\n`
    contactsTS += `    bio: \`${faker.lorem.paragraphs(faker.datatype.number({ min: 1, max: 3 }), '\n')}\`,\n`
    contactsTS += '  },\n'
  })
  contactsTS += ']\n'

  fs.writeFileSync(path.resolve('./src/data/contacts.ts'), contactsTS)
}

generateContacts()
