import Channels from "../components/Channels/channels";
import ProtectedRoute from "../components/ProtectedRoute";

export default function ChannelsPage(){
    return (
        <ProtectedRoute>
            <Channels></Channels>
        </ProtectedRoute>
    )
}