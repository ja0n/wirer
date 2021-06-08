import BaseWire from "./BaseWire";
import Port from "./Port";
import Node from "./Node";

export type NodeModel = Node;

export type Zoom = number;

export type Position = { x: number; y: number; };

export type Offset = Position; 

export type TargetWrappers = BaseWire | Node | Port
export type TargetElement = Element & { type: string; wrapper: TargetWrappers }