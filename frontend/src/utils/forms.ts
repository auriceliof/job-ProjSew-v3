export function toValues(inputs: any) {

    const data: any = {};
    for (var name in inputs) {
        data[name] = inputs[name].value;
    }
    return data;
}
