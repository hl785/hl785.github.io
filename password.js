class PasswordManager {
    constructor(onSuccessLam, maxStore = 20, passHash = 1372867542134400){
        this.onSuccessLam = onSuccessLam;
        this.maxStore = maxStore;
        this.passHash = passHash;
        this.store = [];
    }

    keyPress(event) {
        const newVal = { val: event.keyCode };
        this.store.unshift(newVal);

        if (this.store.length > this.maxStore) {
            this.store.pop();
        }

        for (let i = 0; i < this.store.length; i++) {
            let val = 1;
            for (let j = 0; j < i + 1; j++) {
                val = val * this.store[j].val;
            }
            
            if (val == this.passHash) {
                // console.log('Correct')
                this.onSuccessLam();
                return;
            }
        }
    }
}