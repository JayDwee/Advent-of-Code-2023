// Day 20: Pulse Propagation
import { readFileSync } from 'fs'

enum Signal { Low, High }

class DirectedSignal {
    constructor(
        public sourceModuleName: string,
        public targetModuleName: string,
        public signal: Signal) {}
}

interface Module {
    name : string
    outputs : Array<string>
    callCount : number
    isOriginalState() : boolean
    trigger(signal : DirectedSignal) : Array<DirectedSignal>
}

class Broadcaster implements Module {
    public name : string = 'broadcaster'
    public outputs : Array<string>
    public callCount: number = 0;

    constructor(moduleStr: string) {
        if (!moduleStr.startsWith('broadcaster')) {
            throw new Error('Invalid module string');
        }
        let splitStr = moduleStr.split(' -> ')
        this.outputs = splitStr[1].split(', ')
    }

    trigger(signal : DirectedSignal) : Array<DirectedSignal> {
        this.callCount++
        return this.outputs.map(output => new DirectedSignal(this.name, output, signal.signal))
    }

    isOriginalState(): boolean {return true}
}

class FlipFlop implements Module {
    public name : string;
    public outputs : Array<string>
    public callCount: number = 0;
    private status : boolean

    constructor(moduleStr: string) {
        if (!moduleStr.startsWith('%')) {
            throw new Error('Invalid module string');
        }
        let splitStr = moduleStr.split(' -> ')
        this.name = splitStr[0].slice(1)
        this.outputs = splitStr[1].split(', ')
        this.status = false
    }

    trigger(signal: DirectedSignal): Array<DirectedSignal> {
        this.callCount++
        if (signal.signal == Signal.High) {
            return []
        }
        this.status = !this.status
        if (this.status) {
            return this.outputs.map(output => new DirectedSignal(this.name, output, Signal.High))
        } else {
            return this.outputs.map(output => new DirectedSignal(this.name, output, Signal.Low))
        }
    }

    isOriginalState(): boolean { return !this.status }
}

class Conjunction implements Module {
    public name : string
    public outputs : Array<string>
    public callCount: number = 0;
    private inputs : Map<string, Signal>
    private lcmInputs : Map<string, number> = new Map()
    private lcm : number = 0

    constructor(moduleStr: string) {
        if (!moduleStr.startsWith('&')) {
            throw new Error('Invalid module string');
        }
        let splitStr = moduleStr.split(' -> ')
        this.name = splitStr[0].slice(1)
        this.outputs = splitStr[1].split(', ')
        this.inputs = new Map()
    }

    addInput(...inputName : string[]) {
        for (const name of inputName) {
            this.inputs.set(name, Signal.Low)
        }
    }

    trigger(signal: DirectedSignal): Array<DirectedSignal> {
        this.callCount++
        this.inputs.set(signal.sourceModuleName, signal.signal)
        if (signal.signal == Signal.High && !this.lcmInputs.has(signal.sourceModuleName)){
            this.lcmInputs.set(signal.sourceModuleName, buttonPushes)
            if (this.lcmInputs.size == this.inputs.size) {
                console.log(this.name, this.lcmInputs, lowestCommonMultiple(...this.lcmInputs.values()))
                this.lcm = [...this.lcmInputs.values()].reduce((a,b) => a*b)
            }
        }

        if ([...this.inputs.values()].every(value => value == Signal.High)) {
            return this.outputs.map(output => new DirectedSignal(this.name, output, Signal.Low))
        } else {
            return this.outputs.map(output => new DirectedSignal(this.name, output, Signal.High))
        }
    }

    isOriginalState(): boolean { return [...this.inputs.values()].every(value => value == Signal.Low)}

}

function executeCycle(modules : Map<string, Module>){
    let callQueue: Array<DirectedSignal> = new Array()
    callQueue.push(new DirectedSignal('button', 'broadcaster', Signal.Low))
    while (callQueue.length > 0) {
        let signal : DirectedSignal = callQueue.shift()!
        signalCount.set(signal.signal, signalCount.get(signal.signal)! + 1)
        // console.log(signal.sourceModuleName, `-${Signal[signal.signal]}->`, signal.targetModuleName)
        if (modules.has(signal.targetModuleName)) {
            callQueue.push(...modules.get(signal.targetModuleName)!.trigger(signal))
        }
    }
}

function gcd(a: number, b: number) : number{
    return b == 0 ? a : gcd(b, a % b);
}

function lowestCommonMultiple(...nums: number[]) : number {
    return nums.reduce((a, b) => (a * b) / gcd(a, b));
}

let inputMap : Map<string, Array<string>> = new Map()
let conjunctions : Array<Conjunction> = []
let modules : Map<string, Module> = new Map()

readFileSync('./day-20/input', 'utf8').split(/\r?\n/).forEach(line => {
    let newModule : Module
    if(line[0] == '%') {
        newModule = new FlipFlop(line)
    } else if (line[0] == '&') {
        newModule = new Conjunction(line)
        conjunctions.push(newModule as Conjunction)
    } else {
        newModule = new Broadcaster(line)
    }
    for (const output of newModule.outputs) {
        if (!inputMap.has(output)) {
            inputMap.set(output, [])
        }
        inputMap.get(output)!.push(newModule.name)
    }
    modules.set(newModule.name, newModule)
})

for (const conjunction of conjunctions) {
    conjunction.addInput(...inputMap.get(conjunction.name)!)
}

// console.log(modules)
let signalCount : Map<Signal, number> = new Map()
signalCount.set(Signal.Low, 0)
signalCount.set(Signal.High, 0)


let buttonPushes : number = 0

do {
    buttonPushes++
    executeCycle(modules)
} while (![...modules.values()].every(value => value.isOriginalState()) && buttonPushes < 10000000000)

// modules.forEach(module => console.log(module.name, module.callCount))
console.log(buttonPushes)
console.log(signalCount)

let lowSignals : number = signalCount.get(Signal.Low)!*(1000/buttonPushes)
let highSignals : number = signalCount.get(Signal.High)!*(1000/buttonPushes)

console.log(lowSignals, highSignals, lowSignals*highSignals)
