import {
    Description,
    Divider,
    Input,
    Note,
    Pagination,
    Text,
} from "@geist-ui/core";
import {Alert, Button, Checkbox, Segmented, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {log} from "console";
import {ArrowRight, Minus, Plus, X} from "lucide-react";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";

interface ITableEDIT {
    //
}

interface IProps {
    onFinish: () => unknown;
}

function Contract({onFinish}: IProps) {
    const {t, i18n} = useTranslation();
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <Text h3>5. Шартнома (Оммавий оферта)</Text>

            <div className="h-[20px]"/>

            <object
                data="/sample.pdf"
                type="application/pdf"
                width="100%"
                height="500px"
            >
                <p>
                    Unable to display PDF file. <a href="/zumda.docx">Download</a>{" "}
                    instead.
                </p>
            </object>

            <Checkbox
                checked={isChecked}
                onChange={(value) => setIsChecked((prev) => !prev)}
            >
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia, nihil!
            </Checkbox>

            <div className="h-[20px]"/>

            <Button
                onClick={onFinish}
                type="primary"
                disabled={!isChecked}
            >
                {t("Шартномани олиш")}
            </Button>
            <div className="h-[40px]"/>
        </>
    );
}

export default Contract;
