import * as faker from 'faker'
import * as fs from 'fs'
import * as path from 'path'

const generateContacts = () => {
  fs.readdirSync(path.resolve('./src/data/avatars'))
    .forEach((fileName) => fs.renameSync(path.resolve(`./src/data/avatars/${fileName}`), path.resolve(`./src/data/avatars/${fileName.replace(/\s/g, '_')}`)))

  const avatarsRaw = fs.readdirSync(path.resolve('./src/data/avatars'))
    .filter((file) => /^[_A-za-z]+\.png$/.test(file))

  let contactsTS = 'import { ImageRequireSource } from \'react-native\'\n\n'
  contactsTS += 'export interface ContactData {\n'
  contactsTS += '  avatar: ImageRequireSource\n'
  contactsTS += '  firstName: string\n'
  contactsTS += '  lastName: string\n'
  contactsTS += '  job: string\n'
  contactsTS += '  bio: string\n'
  contactsTS += '}\n\n'
  contactsTS += 'export const contacts: ContactData[] = [\n'
  avatarsRaw.forEach((file) => {
    contactsTS += '  {\n'
    contactsTS += `    avatar: require('./avatars/${file}'),\n`
    contactsTS += `    firstName: '${file.split('.')[0].split('_')[0]}',\n`
    contactsTS += `    lastName: '${file.split('.')[0].split('_').splice(1).join(' ')}',\n`
    contactsTS += `    job: '${faker.name.jobTitle()}',\n`
    contactsTS += `    bio: \`${faker.lorem.paragraphs(faker.datatype.number({ min: 1, max: 3 }), '\n')}\`,\n`
    contactsTS += '  },\n'
  })
  contactsTS += ']\n'

  fs.writeFileSync(path.resolve('./src/data/contacts.ts'), contactsTS)
}

generateContacts()
