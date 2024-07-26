import {NextRequest, NextResponse} from "next/server";

export const config = {
	runtime: 'edge',
};const test = async (req: NextRequest) => {
	return NextResponse.json( 'success');
}
export default test