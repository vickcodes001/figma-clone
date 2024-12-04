// this is the file that will handle everything that has to do something with
// live blocks functionality
import React, { useCallback, useEffect, useState, createContext, useContext } from 'react'
import LiveCursors from './cursor/LiveCursors'
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '@liveblocks/react/suspense'
import CursorChat from './cursor/CursorChat';
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type';
import ReactionSelector from '@/app/reaction/ReactionButton';
import FlyingReaction from '@/app/reaction/FlyingReaction';
import useInterval from '@/hooks/useInterval';

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

// Create a context for presence management
const PresenceContext = createContext<any>(null);

// Define the type for the cursor
type Cursor = {
    mode: CursorMode;
    isPressed?: boolean;
    x?: number;
    y?: number;
    reaction?: string;
};

type Presence = {
    cursor: Cursor | null;
    message: string | null;
    mode?: CursorMode;
    previousMessage?: string | null;
    reaction?: string;
    isPressed?: boolean;
};

const Live = ({ canvasRef }: Props) => {
    const [presence, setPresence] = useState<Presence>({ cursor: null, message: null });
    const [others, setOthers] = useState([]); // Manage other users' presence
    const [reactions, setReactions] = useState<Reaction[]>([]);

    // Function to update presence
    const updateMyPresence = (newPresence: any) => {
        setPresence((prev) => ({ ...prev, ...newPresence }));
        // Here you would also handle broadcasting this presence to others
    };

    // Function to handle incoming events (you would need to implement this)
    const handleEvent = (eventData: any) => {
        // Update reactions based on event data
        setReactions((prev) => [...prev, eventData]);
    };

    // Example of using useEffect to listen for events
    useEffect(() => {
        // Set up event listeners here
        // For example, WebSocket or other event listeners
        return () => {
            // Clean up event listeners
        };
    }, []);

    useInterval(() => {
        setReactions((reaction) => reaction.filter((r) => r.timestamp > Date.now() - 4000));
    }, 1000);

    useInterval(() => {
        if (presence.cursor && presence.cursor.mode === CursorMode.Reaction && presence.cursor.isPressed) {
            const { x, y, reaction } = presence.cursor;
            if (x !== undefined && y !== undefined && reaction) {
                setReactions((reaction) => reaction.concat([
                    {
                        point: { x, y },
                        value: reaction as unknown as string,
                        timestamp: Date.now()
                    }
                ]));
            }
        }
    }, 100);

    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        event.preventDefault();
        if (presence.cursor == null || presence.cursor.mode !== CursorMode.ReactionSelector) {
            const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
            const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
            updateMyPresence({ cursor: { x, y } });
        }
    }, [presence.cursor]);

    const handlePointerLeave = useCallback((event: React.PointerEvent) => {
        event.preventDefault();
        updateMyPresence({ cursor: null, message: null });
    }, []);

    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
        updateMyPresence({ cursor: { x, y } });
        setPresence((state: Presence) =>
            state.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
        );
    }, [presence.mode]);

    const handlePointerUp = useCallback((event: React.PointerEvent) => {
        setPresence((state: Presence) =>
            state.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state
        );
    }, [presence.mode]);

    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.key === '/') {
                setPresence({
                    cursor: null,
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: ''
                });
            } else if (e.key === 'Escape') {
                updateMyPresence({ message: '' });
                setPresence({ cursor: null, mode: CursorMode.Hidden, message: null });
            } else {
                setPresence({ cursor: null, mode: CursorMode.ReactionSelector, message: null });
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/') {
                e.preventDefault();
            }
        };

        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [updateMyPresence]);

    const setReaction = useCallback((reaction: string) => {
        setPresence({ cursor: null, mode: CursorMode.Reaction, reaction, isPressed: false, message: null });
    }, []);

    return (
        <div
            id='canvas'
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className='h-[100vh] w-full flex justify-center items-center text-center'
        >
            <canvas ref={canvasRef} />
            {reactions.map((r, index) => (
                <FlyingReaction
                    key={`${r.timestamp.toString()}-${index}`}
                    x={r.point.x}
                    y={r.point.y}
                    timestamp={r.timestamp}
                    value={r.value}
                />
            ))}
            {presence.cursor && (
                <CursorChat
                    cursor={presence.cursor ? { x: presence.cursor.x ?? 0, y: presence.cursor.y ?? 0 } : { x: 0, y: 0 }}
                    cursorState={{
                        ...presence,
                        mode: presence.mode === CursorMode.Reaction ? CursorMode.Reaction : CursorMode.Hidden,
                        reaction: presence.reaction ?? '',
                        isPressed: presence.isPressed ?? false 
                    }}
                    setCursorState={(cursorState: CursorState) => {
                        setPresence((prev) => ({
                            ...prev,
                            mode: cursorState.mode,
                            reaction: '',
                            isPressed: false,
                        }))
                    }}
                    updateMyPresence={updateMyPresence}
                />
            )}
            {presence.mode === CursorMode.ReactionSelector && (
                <ReactionSelector setReaction={setReaction} />
            )}
            <LiveCursors others={others} />
        </div>
    );
}

export default Live
