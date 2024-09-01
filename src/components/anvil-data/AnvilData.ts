import assert from "assert";

import {
    RiotBase,
} from "riotjs-simple-typescript";

import {
    Service,
} from "openodin";

import {
    AnvilThreadController,
} from "../../lib/AnvilThreadController";

import {
    modal,
} from "../../lib/modal";

import {
    AnvilOpenThreadModalProps,
} from "./anvil-openthread-modal/AnvilOpenThreadModal";

import {
    stateController,
} from "riotjs-simple-state";

import {
    SharedEditState,
} from "../anvil/Anvil";

export interface AnvilDataProps {
    service: Service;
}

export interface AnvilDataState {
    tabId: number;
    threads: AnvilThreadController[];
}

export class AnvilData extends RiotBase<AnvilDataProps, AnvilDataState> {
    protected threadId: number = 1;
    //protected editState: SharedEditState = {};

    public onBeforeMount(props: AnvilDataProps, state: AnvilDataState) {
        state.threads = [];
        state.tabId = 0;

        // TODO hook service onClose kill all threads
    }

    public openThread = () => {
        stateController.load("editState").then( (editState: SharedEditState) => {
            if (editState.appConf?.threads) {
                const threads = Object.keys(editState.appConf.threads);

                const done = (name?: string) => {
                    if (name) {
                        const threadTemplate = editState.appConf?.threads[name];

                        assert(threadTemplate, "Expecting threadTemplate to exist");

                        this.initThread(name, threadTemplate);
                    }

                    this.update();
                };

                const props: AnvilOpenThreadModalProps = {
                    threads,
                    done,
                };

                modal.open("anvil-openthread-modal", props);
            }
        });
    }

    protected initThread(name: string, threadTemplate: Record<string, any>) {
        this.state.threads.push(
            new AnvilThreadController(this.props.service, this.threadId, `${name}#${this.threadId}`, threadTemplate),
        );

        this.state.tabId = this.threadId;

        this.threadId++;
    }

    public tabClicked = (id: number) => {
        this.state.tabId = id;

        this.update();
    }
}
