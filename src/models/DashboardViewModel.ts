import { ViewModel } from "./ViewModel";

export default class DashboardViewModel extends ViewModel {
    constructor() {
        super();
        this.setActiveMenu('/');
    }
}