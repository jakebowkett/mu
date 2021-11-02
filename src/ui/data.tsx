
import { TNode } from "./Tree"

const fileList: TNode[] = [
    {
        id: "thing",
        text: "Evidence",
        children: [
            {
                id: "typical",
                text: "Typical",
                children: [
                    {
                        id: "excavation",
                        text: "Excavation",
                    },
                    {
                        id: "deviations",
                        text: "Deviations",
                    },
                ],
            },
            {
                id: "supra",
                text: "Supra",
                children: [
                    {
                        id: "x",
                        text: "---------",
                        redacted: true,
                    },
                ],
            },
            {
                id: "protocol",
                text: "Protocol",
                children: [
                    {
                        id: "artifact",
                        text: "Artifacts",
                    },
                    {
                        id: "witness",
                        text: "Witnesses",
                    },
                ],
            },
        ],
    },
    {
        id: "dossiers",
        text: "Dossiers",
        children: [
            {
                id: "agent",
                text: "Agents",
                children: [
                    {
                        id: "sa1",
                        text: "----------------",
                        redacted: true,
                        classified: true,
                    },
                    {
                        id: "sa2",
                        text: "-----------",
                        redacted: true,
                        classified: true,
                    },
                ],
            },
            {
                id: "targets",
                text: "Targets",
                children: [
                    {
                        id: "tran",
                        text: "Rachel Tran",
                    },
                ],
            },
            {
                id: "monitor",
                text: "On Monitoring",
                children: [
                    {
                        id: "principles",
                        text: "Basic Principles",
                    },
                    {
                        id: "seraph",
                        text: "Seraph",
                    },
                    {
                        id: "wall-fly",
                        text: "Wall Fly",
                    },
                ],
            },
        ],
    },
    {
        id: "encrypted",
        text: "--------------",
        redacted: true,
        children: [
            {
                id: "e",
                text: "-----------------",
                classified: true,
                redacted: true,
            },
        ],
    },
];

export {fileList};