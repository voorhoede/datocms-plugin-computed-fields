import { RenderConfigScreenCtx } from 'datocms-plugin-sdk'
import { Canvas } from 'datocms-react-ui'

type Props = {
  ctx: RenderConfigScreenCtx
}

export default function ConfigScreen({ ctx }: Props) {
  return (
    <Canvas ctx={ctx}>
      <p>
        This DatoCMS plugin allows to compute and define a field value based on
        other fields. This allows pretty “preview” values in the CMS (used in
        model overviews and for linked models). And moves logic from clients to
        a central place: the API.
      </p>
    </Canvas>
  )
}
