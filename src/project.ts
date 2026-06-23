import { makeProject } from '@motion-canvas/core';
import intro from './scenes/intro?scene';
import pipelinesData from './scenes/pipelines-data?scene';
import pipelinesQuery from './scenes/pipelines-query?scene';
import errorsExplain from './scenes/errors-explain?scene';
import explain from './scenes/explain?scene';
import pipelinesDebug from './scenes/pipelines-debug?scene';
import pipelinesCompose from './scenes/pipelines-compose?scene';
import branching from './scenes/branching?scene';
import reproducibility from './scenes/reproducibility?scene';
import outro from './scenes/outro?scene';
import audioFile from '../Please_Remain_On_The_Line.mp3';

export default makeProject({
  scenes: [
    intro,
    pipelinesData,
    pipelinesQuery,
    errorsExplain,
    explain,
    pipelinesDebug,
    pipelinesCompose,
    branching,
    reproducibility,
    outro,
  ],
  audio: audioFile,
});
