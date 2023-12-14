// Day 14: Parabolic Reflector Dish
import { readFileSync } from 'fs'

function main() {
    const lines : string[] = readFileSync('./day-14/input', 'utf8').split(/\r?\n/)
    let total : number = 0
    for (const columnNumber of lines.keys()) {
        const column : string[] = lines.map(l => l[columnNumber]).reverse()
        let rolling : number = 0
        for (const lineNumber of column.keys()){
            if (column[lineNumber] == "#"){
                let sub : number = 0
                while (rolling > 0 ) {
                    total+=lineNumber-sub
                    sub++
                    rolling--
                }
            } else if (column[lineNumber] == "O"){
                rolling++
            } 
            
        }
        let sub : number = 0
        while (rolling > 0 ) {
            total+=column.length-sub
            sub++
            rolling--
        }

        console.log("column",column,"total",total)

    }

    console.log(total)
}

main()