module Jekyll
  class FancyListBlock < Liquid::Block
    def initialize(tag_name, args, tokens)
      super
    end

    def render(context)
      "<ul class=\"fancy-list\">#{super}</ul>"
    end
  end

  class FancyListItemBlock < Liquid::Block
    def initialize(tag_name, raw_args, tokens)
      args = Helpers.parse_args(raw_args)

      if args.length != 2
        raise "Expected 2 arguments. Got #{args.length}."
      end

      # Remove all leading '/' characters just to be sure
      @img_src = "/img/icons/linericons/" + args[0].gsub(/^\/+/, "")
      @title = args[1]
      super
    end

    def render(context)
<<EOS
<li class="fancy-list-item">
  <div class="image"><img src="#{@img_src}" /></div>
  <div class="title">#{@title}</div>
  <div class="desc">#{super}</div>
  <div class="clear-float"></div>
</li>
EOS
    end
  end
end

Liquid::Template.register_tag("fancylistitem", Jekyll::FancyListItemBlock)
Liquid::Template.register_tag("fancylist", Jekyll::FancyListBlock)
