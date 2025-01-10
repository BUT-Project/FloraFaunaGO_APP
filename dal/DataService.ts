import StubData from "@/dal/StubLib/StubData"

const useStub = __DEV__;
export default function dataService() {
    if (useStub) {
        return new StubData();
    } else {
       // return new RealApiService();
    }
}