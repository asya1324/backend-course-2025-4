const { Command } = require('commander')
const fs = require('fs')
const http = require('http')

const program = new Command()

program
  .requiredOption('-i, --input <path>', 'input file path')
  .requiredOption('-H, --host <host>', 'server host')
  .requiredOption('-p, --port <port>', 'server port')

program.parse()

const options = program.opts()

if (!fs.existsSync(options.input)) {
  console.log('Cannot find input file')
  process.exit(1)
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Server is running')
})

server.listen(options.port, options.host, () => {
  console.log(`Server started at http://${options.host}:${options.port}`)
})
