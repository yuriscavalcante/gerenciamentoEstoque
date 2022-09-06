import { ActionSheetButton, AnimationBuilder } from "@ionic/angular";
import { Mode } from "@ionic/core";

export interface ActionSheetOptions {
    header?: string;
    subHeader?: string;
    cssClass?: string | string[];
    buttons: (ActionSheetButton | string)[];
    backdropDismiss?: boolean;
    translucent?: boolean;
    animated?: boolean;
    mode?: Mode;
    keyboardClose?: boolean;
    id?: string;
    htmlAttributes?: { [key: string]: any };
  
    enterAnimation?: AnimationBuilder;
    leaveAnimation?: AnimationBuilder;
}
