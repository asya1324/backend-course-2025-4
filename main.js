const { Command } = require('commander')
const fs = require('fs/promises')
const http = require('http')
const { XMLBuilder } = require('fast-xml-parser')

const program = new Command()

program
  .requiredOption('-i, --input <path>')
  .requiredOption('-H, --host <host>')
  .requiredOption('-p, --port <port>')

program.parse()
const options = program.opts()

const server = http.createServer(async (req, res) => {
  try {
    console.log("REQUEST:", req.url)

    const url = new URL(req.url, `http://${options.host}:${options.port}`)
    const survivedQuery = url.searchParams.get('survived')
    const ageQuery = url.searchParams.get('age')

    const fileContent = await fs.readFile(options.input, 'utf-8')

    let passengers = fileContent
      .trim()
      .split('\n')
      .map(line => JSON.parse(line))

    if (survivedQuery === 'true') {
      passengers = passengers.filter(p => p.Survived == 1)
    }

    const xmlData = {
      passengers: {
        passenger: passengers.map(p => {
          const obj = {
            name: p.Name,
            ticket: p.Ticket
          }

          if (ageQuery === 'true') {
            obj.age = p.Age
          }

          return obj
        })
      }
    }

    const builder = new XMLBuilder({
      format: true
    })

    const xml = builder.build(xmlData)

    res.writeHead(200, { 'Content-Type': 'application/xml' })
    res.end(xml)

  } catch (err) {
    console.log("ERROR:", err)
    res.writeHead(500)
    res.end('Server error')
  }
})

server.listen(options.port, options.host, () => {
  console.log(`Server started at http://${options.host}:${options.port}`)
})
