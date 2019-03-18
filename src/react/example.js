import Brick from 'brick';
import { useBrick } from 'brick';

const state = useBrick();

const MyBrick = ({ ports, enabled, value, gui, name } = state) => (
    <article id={uuid}>
        <section id={ports.in}>
            ({ports.in.map(port => (
                <svg src="ball" color={port.color} active={port.active}></svg>
            ))})
        </section>
        <section id={gui}>
            <header>{name}</header>
            ({gui.map(input => (
                <label>
                    <span>{label}</span>
                    <input type={type} />
                </label>
            ))})
        </section>
        <section id={ports.out}>
            ({ports.out.map(port => (
                <svg src="ball" color={port.color} active={port.active}></svg>
            ))})
        </section>
    </article>
)