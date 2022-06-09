// @generated by protobuf-ts 2.6.0 with parameter server_generic,generate_dependencies
// @generated from protobuf file "ErrorRpc.proto" (syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message HelloRequest
 */
export interface HelloRequest {
    /**
     * @generated from protobuf field: string myName = 1;
     */
    myName: string;
}
/**
 * @generated from protobuf message HelloResponse
 */
export interface HelloResponse {
    /**
     * @generated from protobuf field: string greeting = 1;
     */
    greeting: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class HelloRequest$Type extends MessageType<HelloRequest> {
    constructor() {
        super("HelloRequest", [
            { no: 1, name: "myName", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message HelloRequest
 */
export const HelloRequest = new HelloRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class HelloResponse$Type extends MessageType<HelloResponse> {
    constructor() {
        super("HelloResponse", [
            { no: 1, name: "greeting", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message HelloResponse
 */
export const HelloResponse = new HelloResponse$Type();
/**
 * @generated ServiceType for protobuf service ErrorRpc
 */
export const ErrorRpc = new ServiceType("ErrorRpc", [
    { name: "timeout", options: {}, I: HelloRequest, O: HelloResponse },
    { name: "serverError", options: {}, I: HelloRequest, O: HelloResponse },
    { name: "unknownMethod", options: {}, I: HelloRequest, O: HelloResponse }
]);
