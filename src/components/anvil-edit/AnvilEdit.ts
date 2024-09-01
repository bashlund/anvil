import assert from "assert";

import {
    RiotBase,
} from "riotjs-simple-typescript";

import {
    SharedEditState,
} from "../anvil/Anvil";

import {
    router,
} from "riotjs-simple-router";

import {
    stateController,
} from "riotjs-simple-state";

export interface AnvilEditProps {}

export interface AnvilEditState {}

export class AnvilEdit extends RiotBase<AnvilEditProps, AnvilEditState> {
    protected editState: SharedEditState = {};
    protected router = router;

    public onBeforeMount(props: AnvilEditProps, state: AnvilEditState) {}

    public onMounted(props: AnvilEditProps, state: AnvilEditState) {
        stateController.load("editState").then( (editState: SharedEditState) => {
            this.editState = editState;

            this.update();

            this.resetUI();
        });
    }

    protected resetUI() {
        assert(this.editState, "Expected editState to be loaded");

        if (this.editState.appConf) {
            const json = JSON.stringify(this.editState.appConf ?? {}, null, 4);

            ((this.$("#edit-area") ?? {}) as HTMLInputElement).value = json;
        }
    }

    public onBeforeUpdate(props: AnvilEditProps, state: AnvilEditState) {}

    public onchange = () => {
        assert(this.editState, "Expected editState to be loaded");

        if (this.editState.isSaved) {
            this.editState.isSaved = false;

            stateController.publish("editState", this.editState);

            this.update();
        }
    }

    public save = () => {
        assert(this.editState, "Expected editState to be loaded");

        const value = (this.$("#edit-area") as HTMLInputElement).value;

        try {
            this.editState.appConf = JSON.parse(value);

            stateController.publish("editState", this.editState);
        }
        catch(e) {
            alert("Error in JSON");

            return;
        }

        this.editState.isSaved = true;

        this.update();
    }

    public discard = () => {
        this.editState.isSaved = true;

        stateController.publish("editState", this.editState);

        this.resetUI();

        this.update();
    }
}