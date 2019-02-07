export default function path(method, value) {
    return function ( target, property, descriptor ) {
        descriptor.value.___method = method;
        descriptor.value.___path = value;
        return descriptor;
    }
}
