import {Navigate, useLocation, useNavigate} from "react-router-dom";
import "./Provider.css"
import {ReactNode} from "react";

export default function Provider() {
    const navigate = useNavigate();
    const {state}: { state: { detail: ProviderDetail } } = useLocation();
    if (state === null) {
        return <Navigate to="/"/>
    }
    const {detail} = state;
    console.log(detail)
    const onClick = () => {
        navigate(-1);
    }
    return (
        <>
            <div className="provider">
                <div className="title">
                    <img src={detail.info["x-logo"].url} alt="logo" className="logo"></img>
                    {detail.info.title}
                </div>
                <div className="details">
                    <DetailBox title="Description">
                        <div className="detail-text">{detail.info?.description}</div>
                    </DetailBox>
                    <DetailBox title="Swagger">
                        <div className="detail-text">{detail.swaggerUrl}</div>
                    </DetailBox>
                    <DetailBox title="Contact">
                        <div className="contact-box">
                            <div className="contact-title-box">
                                <div>Email</div>
                                <div>Name</div>
                                <div>Url</div>
                            </div>
                            <div className="contact-text-box">
                                <div
                                    className="detail-text">{detail.info?.contact?.email ? detail.info.contact.email : '-'}</div>
                                <div
                                    className="detail-text">{detail.info?.contact?.name ? detail.info.contact.name : '-'}</div>
                                <div
                                    className="detail-text">{detail.info?.contact?.url ? detail.info.contact.url : '-'}</div>
                            </div>
                        </div>
                    </DetailBox>
                </div>
                <button onClick={onClick}> Explore more APIs</button>
            </div>
        </>
    )
}

function DetailBox({title, children}: { title: string, children: ReactNode }) {
    return (
        <div className="detail-box">
            <div className="detail-title">{title}</div>
            {children}
        </div>
    )
}