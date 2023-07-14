import './SideBar.css'
import {UpArrow} from '../common/UpArrow.tsx'
import {MouseEventHandler, ReactNode, useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {DownArrow} from "../common/DownArrow.tsx";

const GetLocalStorageOrEmptyString = (key: string): string => {
    const result = window.localStorage.getItem(key);
    return result === null ? "" : result;
}

export default function SideBar({onBackdropClick}: { onBackdropClick: () => void }) {
    const SELECTED_PROVIDER_ID = 'SELECTED_PROVIDER_ID';
    const [providers, setProviders] = useState<string[]>([]);
    const [selectedProviderId, setSelectedProviderId] = useState<string>(GetLocalStorageOrEmptyString(SELECTED_PROVIDER_ID));
    const [selectedProviderDetails, setSelectedProviderDetails] = useState<ProviderDetail[]>([])

    useEffect(() => {
        axios.get<ProvidersNameResp>("https://api.apis.guru/v2/providers.json").then(res => {
            setProviders(res.data.data)
        }).catch(e => {
            console.error(e);
        });
    })

    useEffect(() => {
        if (selectedProviderId === "") {
            return;
        }
        axios.get<ProviderDetailsResp>(`https://api.apis.guru/v2/${selectedProviderId}.json`).then(res => {
            const providerDetails: ProviderDetail[] = [];
            for (const key in res.data.apis) {
                providerDetails.push(res.data.apis[key]);
            }
            setSelectedProviderDetails(providerDetails);
        }).catch(e => {
            console.error(e);
        })
    }, [selectedProviderId])

    const onClickExpand = (event: React.MouseEvent<HTMLButtonElement>) => {
        const targetId: string = (event.target as HTMLButtonElement).id;
        let newId: string;
        if (targetId === selectedProviderId) {
            newId = "";
        } else {
            newId = targetId;
        }
        setSelectedProviderId(newId);
        window.localStorage.setItem(SELECTED_PROVIDER_ID, newId);
        setSelectedProviderDetails([]);
    }

    return (
        <>
            <div className="nav-sidebar">
                <Backdrop onBackdropClick={onBackdropClick}>
                    <div className="sidebar">
                        <span style={{fontWeight: 500}}> Select Provider </span>
                        <div className="providerEntries">
                            {providers.map(
                                (provider: string) =>
                                    <ProviderEntry providerName={provider}
                                                   providersDetail={selectedProviderDetails}
                                                   selected={selectedProviderId === provider}
                                                   onClickExpand={onClickExpand}
                                    />
                            )}
                        </div>
                    </div>
                </Backdrop>
            </div>
        </>
    )
}

function ProviderEntry({providerName, providersDetail, selected, onClickExpand}: {
    providerName: string,
    providersDetail: ProviderDetail[],
    selected: boolean,
    onClickExpand: MouseEventHandler
}) {
    const navigate = useNavigate();
    const onClickSelect = (selectedProviderDetail: ProviderDetail) => {
        navigate("/provider", {
            state: {
                detail: selectedProviderDetail
            }
        })
    }
    return (
        <>
            <div className={selected ? "providerEntrySelected" : "providerEntry"}>
                <button id={providerName} className="expandButton" onClick={onClickExpand}>
                    {providerName}
                    {selected ? <UpArrow width="2rem" height="2rem"/> : <DownArrow width="2rem" height="2rem"/>}
                    {/*<img className="icon" src={selected ? arrowUp : arrowDown} alt="toggle"/>*/}
                </button>
                {selected ?
                    providersDetail.map(providerDetail => {
                        return (
                            <button className="descButton" onClick={() => onClickSelect(providerDetail)}>
                                <img className="logo"
                                     src={providerDetail.info["x-logo"].url}
                                     alt="logo"/>
                                {providerDetail.info.title}
                            </button>
                        )
                    })
                    : null}
            </div>
        </>
    )
}

function Backdrop({children, onBackdropClick}: { children: ReactNode, onBackdropClick: () => void }) {
    const handleBackdropClick: EventListenerOrEventListenerObject = (event: Event) => {
        if (document.getElementsByClassName('backdrop')[0] === event.target) {
            onBackdropClick();
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleBackdropClick);
        return () => document.removeEventListener("click", handleBackdropClick);
    });

    return (
        <div className="backdrop">
            {children}
        </div>
    )
}
